const express = require('express');
const router = express.Router();

app.post('/expenses', async (req, res) => {
    console.log('Hit /expenses route'); // Add this line
    try {
      const { description, spending, date_created, name } = req.body;
      const user_id = req.session.user_id;
      const newExpense = await Expense.create({
        name,
        description,
        spending,
        date_created,
        user_id,
    });
  
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;