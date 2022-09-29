<script lang="typescript">
    import type {User} from "$lib/db";
    import {session} from "$app/stores";

    let user: User | undefined
    session.subscribe((current) => {
        user = current.user
    })
    $: username = user ? user.email : 'Guest'
</script>

<svelte:head>
    <title>Welcome, {username}!</title>
</svelte:head>

<h1>Welcome, {username}!</h1>
{#if user}
    <p>You are logged in !</p>
{:else}
    <p>Would you like to <a href="/login">Login</a>?</p>
{/if}