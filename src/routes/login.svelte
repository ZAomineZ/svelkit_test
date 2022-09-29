<script lang="typescript">
    import {session} from "$app/stores";
    import {goto} from "$app/navigation";
    import Form from './_form.svelte';

    let isSubmitting: boolean
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    session.subscribe(() => {})

    const onUpdate = (form) => {
        isSubmitting = form.isSubmitting
        if (form.result?.user) {
            session.set({email: form.result.user.email})
            alert('You are logged in !')
            goto('/')
        }
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<h1>Login</h1>
<Form action="/login" method="POST" {onUpdate}>
    <fieldset>
        <label for="email">Email</label>
        <input type="email" placeholder="user@email.net" name="email" id="email">
        <label for="password">Password</label>
        <input type="password" placeholder="Your password" name="password" id="password">
        <input class="button-primary" type="submit" value="login">
    </fieldset>
</Form>
<p>Don't have an account? <a href="/signup">Signup</a></p>

<style>
    form {
        max-width: 420px;
    }
</style>