// backend/controllers/dashboardController.js
import Transaction from '../models/Transaction.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Show all transactions for all authenticated users (same data for viewer, analyst, admin)
    const matchQuery = {};
    
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    
    // Get total income and expense using separate queries for clarity
    const incomeTotal = await Transaction.aggregate([
      { $match: { ...matchQuery, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const expenseTotal = await Transaction.aggregate([
      { $match: { ...matchQuery, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalIncome = incomeTotal[0]?.total || 0;
    const totalExpense = expenseTotal[0]?.total || 0;
    const netBalance = totalIncome - totalExpense;
    
    // Get category-wise totals for expenses
    const categoryTotals = await Transaction.aggregate([
      { $match: { ...matchQuery, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          total: 1
        }
      }
    ]);
    
    // Get recent transactions (exclude for viewer role)
    const recentTransactions = req.user.role === 'viewer' 
      ? [] 
      : await Transaction.find(matchQuery)
          .sort({ date: -1 })
          .limit(5);
    
    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          ...matchQuery,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month'
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          income: 1,
          expense: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);
    
    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        categoryTotals,
        recentTransactions,
        monthlyTrends
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};