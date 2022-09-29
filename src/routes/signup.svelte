<script lang="typescript">
    import {goto} from "$app/navigation";
    import Form from './_form.svelte'

    let isSubmitting: boolean
    const onUpdate = (form) => {
        isSubmitting = form.isSubmitting
        if (form.result?.user) {
            alert('You are signed up')
            goto('/login')
        }
    }
</script>

<svelte:head>
    <title>Create an account</title>
</svelte:head>

<h1>Create an account</h1>

<Form action="/signup" method="POST" {onUpdate}>
    <fieldset>
        <label for="email">Email</label>
        <input type="email" placeholder="user@email.net" name="email" id="email" required>
        <label for="password">Password, again</label>
        <input type="password" placeholder="Your password" name="password" id="password" required>
        <label for="repeat-password">Password, again</label>
        <input type="password" placeholder="Repeat the password, please" name="repeat-password" id="repeat-password">
        <input type="submit" class="button-primary" value="Signup">
    </fieldset>
</Form>
<p>Already have an account? <a href="/login">Login</a></p>

<style>
    form {
        max-width: 420px;
    }
</style>