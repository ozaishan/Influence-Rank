document.getElementById('influencer-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form reload

  // Get input values
  const name = document.getElementById('name').value;
  const followers = document.getElementById('followers').value;
  const likes = document.getElementById('likes').value || 0;
  const comments = document.getElementById('comments').value || 0;
  const shares = document.getElementById('shares').value || 0;

  // Data to send
  const data = { name, followers, likes, comments, shares };


  // Send POST request to backend
  try {
    console.log(data)
    const response = await fetch('http://localhost:5000/api/add-influencer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Influencer added successfully!');
      document.getElementById('influencer-form').reset(); // Clear the form
    } else {
      alert('Error adding influencer. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error connecting to server.');
  }
});