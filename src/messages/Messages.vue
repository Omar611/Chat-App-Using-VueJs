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
                    this.messages.push(snapshot.val());
                    this.$nextTick(() => {
                        this.scrollToLastMessage();
                    });
                });
        },
        detachLinstners() {
            if (this.channel !== null) {
                this.messagesRef.child(this.channel.id).off();
            }
        },
        scrollToLastMessage() {
            var innerContainer = document.querySelector(
                ".inner-messages-container"
            );
            innerContainer.scrollTop = innerContainer.scrollHeight;
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
    min-height: calc(100vh - 51px);
    position: relative;
}
</style>
