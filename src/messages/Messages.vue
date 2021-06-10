<template>
    <div>
        Messages

        <single-message />
        <message-form />
    </div>
</template>

<script>
import SingleMessage from "./SingleMessage";
import MessageForm from "./MessageForm";

export default {
    name: "messages",
    components: {
        SingleMessage,
        MessageForm,
    },
};
</script>
