import User from '../models/User.js';
// import CreditTransaction from '../models/CreditTransaction.js';

// Get user credits
export const getUserCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      credits: user.credits,
      transactions: await CreditTransaction.find({ user: req.user.id })
        .sort({ createdAt: -1 }),
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ message: 'Error fetching credits' });
  }
};

// Purchase credits
export const purchaseCredits = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate bonus credits based on amount
    let bonusCredits = 0;
    if (amount >= 1000) {
      bonusCredits = 150;
    } else if (amount >= 500) {
      bonusCredits = 50;
    }

    const totalCredits = amount + bonusCredits;

    // Create transaction record
    const transaction = new CreditTransaction({
      user: req.user.id,
      amount: totalCredits,
      type: 'purchase',
      paymentMethod,
      status: 'completed',
    });

    // Update user credits
    user.credits += totalCredits;
    await user.save();
    await transaction.save();

    res.json({
      credits: user.credits,
      transaction,
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({ message: 'Error purchasing credits' });
  }
};

// Get credit packages
export const getCreditPackages = async (req, res) => {
  try {
    const packages = [
      {
        id: 1,
        credits: 100,
        price: 10,
        bonus: 0,
      },
      {
        id: 2,
        credits: 500,
        price: 45,
        bonus: 50,
      },
      {
        id: 3,
        credits: 1000,
        price: 80,
        bonus: 150,
      },
    ];

    res.json(packages);
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ message: 'Error fetching credit packages' });
  }
};

// Get transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await CreditTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
};

// Get system credit stats (admin only)
export const getSystemCreditStats = async (req, res) => {
  try {
    const totalCredits = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$credits' } } },
    ]);

    const totalTransactions = await CreditTransaction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.json({
      totalCredits: totalCredits[0]?.total || 0,
      transactions: totalTransactions,
    });
  } catch (error) {
    console.error('Get credit stats error:', error);
    res.status(500).json({ message: 'Error fetching credit statistics' });
  }
};

export const getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ balance: user.credits });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const transactions = await CreditTransaction.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const transferCredits = async (req, res) => {
    try {
        const { recipientId, amount } = req.body;
        const sender = await User.findById(req.user._id);
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        if (sender.credits < amount) {
            return res.status(400).json({ message: 'Insufficient credits' });
        }

        sender.credits -= amount;
        recipient.credits += amount;

        await sender.save();
        await recipient.save();

        const transaction = new CreditTransaction({
            user: req.user._id,
            amount: -amount,
            type: 'transfer',
            description: `Transfer to ${recipient.name}`
        });
        await transaction.save();

        res.json({ balance: sender.credits, transaction });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await CreditTransaction.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const awardCredits = async (req, res) => {
    try {
        const { userId, amount, reason } = req.body;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.credits += amount;
        await user.save();

        const transaction = new CreditTransaction({
            user: userId,
            amount,
            type: 'award',
            description: reason || 'Admin credit award'
        });
        await transaction.save();

        res.json({ balance: user.credits, transaction });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 

