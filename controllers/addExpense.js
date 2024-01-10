console.log('addExpense.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');

    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const spending = document.getElementById('spending').value;
        const date_created = new Date();
        const name = document.getElementById('name').value;

        try {
            // Directly access user_id from the session
            const user_id = window.user_id

            const response = await axios.post('/expenses', {
                name,
                description,
                spending,
                date_created,
                // user_id, // pulled from req.body
            });

            console.log('Response:', response);

            if (response.status === 201) {
                console.log('Expense added successfully');
            } else {
                console.error('Error adding expense');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
