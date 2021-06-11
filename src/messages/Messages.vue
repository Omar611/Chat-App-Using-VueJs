<template>
    <div>
        <div class="messages-container">
            <single-message :messages="messages" />
            <message-form />
        </div>
    </div>
</template>

<script>
import SingleMessage from "./SingleMessage";
import MessageForm from "./MessageForm";
import database from "firebase/database";
import { mapGetters } from "vuex";

export default {
    name: "messages",
    components: {
        SingleMessage,
        MessageForm,
    },
    data() {
        return {
            messagesRef: firebase.database().ref("messages"),
            messages: [],
            channel: null,
        };
    },
    computed: {
        ...mapGetters(["getCurrentChannel"]),
    },
    watch: {
        getCurrentChannel: function () {
            this.messages = [];
            this.addLinstners();
            this.channel = this.getCurrentChannel;
        },
    },
    methods: {
        addLinstners() {
            this.messagesRef
                .child(this.getCurrentChannel.id)
                .on("child_added", (snapshot) => {
                    console.log("message sent");
                    this.messages.push(snapshot.val());
                });
        },
        detachLinstners() {
            if (this.channel !== null) {
                this.messagesRef.child(this.channel.id).off();
            }
        },
    },
    beforeDestroy() {
        this.detachLinstners();
    },
};
</script>

<style scoped>
.messages-container {
    max-height: 100vh;
    min-height: 97vh;
    position: relative;
}
</style>
