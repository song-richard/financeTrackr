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
            const response = await axios.post('/expenses', {
                name,
                description,
                spending,
                date_created,
            });

            document.getElementById('description').value = '';
            document.getElementById('spending').value = '';
            document.getElementById('name').value = '';

            if (response.status === 201) {
                console.log('Expense added successfully');
                window.location.reload();
            } else {
                console.error('Error adding expense');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
