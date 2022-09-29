<script lang="typescript">
    import type {User} from "$lib/db";
    import {afterUpdate} from "svelte";

    export let action = '/'
    export let method = 'POST'

    type Result = {
        error?: string,
        user?: User
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    export let onUpdate: (state: { result: Result; isSubmitting: boolean }) => void = () => {
    }
    let result: Result
    let isSubmitting = false

    const onSubmit = async (e) => {
        e.preventDefault()

        if (isSubmitting) return
        isSubmitting = true

        const form: HTMLFormElement = e.target.form
        const formData = new FormData(form)
        const data: Record<string, string> = {}
        formData.forEach((value, key) => {
            data[key] = value.toString()
        })

        result = await fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(r => r.json())
            .catch(err => {
                return {error: err.toString()}
            })
        isSubmitting = false
    }
    $: error = result?.error

    afterUpdate(() => onUpdate({result, isSubmitting}))
</script>

<form {method} {action} on:click={onSubmit}>
    <slot/>
    {#if error}
        <p class="error">{error}</p>
    {/if}
</form>

<style>
    form {
        max-width: 420px;
    }

    .error {
        color: red;
    }
</style>