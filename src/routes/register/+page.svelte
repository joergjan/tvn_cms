<svelte:head>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form method="POST">
    <hgroup>
        <h2>Register</h2>
        <h3>To post articles, you'll need an account.</h3>
    </hgroup>

    <label for="name">Name</label>
    <input type="text" id="name" name="name" required />

    <label for="username">Username</label>
    <input type="text" id="username" name="username" required />

    <label for="password">Password</label>
    <input type="password" id="password" name="password" required />

    <button type="submit">Register</button>
</form>
<p>Already have an account? <a href="/login">Login</a></p>
