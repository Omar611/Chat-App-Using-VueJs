<template>
    <div>
        <div class="messages-container">
            <h4 class="channel-name text-light text-center p-2">{{ channelName }}</h4>
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
            privateMessagesRef: firebase.database().ref("privateMessages"),
            messages: [],
            channel: null,
            listeners: [],
        };
    },
    computed: {
        ...mapGetters(["getCurrentChannel", "isPrivate"]),
        channelName() {
            if (this.channel !== null) {
                return this.isPrivate
                    ? "@ " + this.channel.name
                    : "# " + this.channel.name;
            }
        },
    },
    watch: {
        getCurrentChannel: function () {
            this.detachLinstners();
            this.addLinstners();
            this.channel = this.getCurrentChannel;
        },
    },
    methods: {
        addLinstners() {
            const ref = this.getMessagesRef();
            ref.child(this.getCurrentChannel.id).on(
                "child_added",
                (snapshot) => {
                    let message = snapshot.val();
                    message["id"] = snapshot.key;
                    this.messages.push(message);
                    this.$nextTick(() => {
                        this.scrollToLastMessage();
                    });
                }
            );
            this.addToListeners(this.getCurrentChannel.id, ref, "child_added");
        },
        addToListeners(id, ref, event) {
            const index = this.listeners.findIndex((el) => {
                return el.id === id && el.ref === ref && el.event === event;
            });
            if (index === -1) {
                this.listeners.push({ id: id, ref: ref, event: event });
            }
        },
        scrollToLastMessage() {
            var innerContainer = document.querySelector(
                ".inner-messages-container"
            );
            innerContainer.scrollTop = innerContainer.scrollHeight;
        },
        getMessagesRef() {
            if (this.isPrivate) {
                return this.privateMessagesRef;
            } else {
                return this.messagesRef;
            }
        },
        detachLinstners() {
            this.listeners.forEach((listerner) => {
                listerner.ref.child(listerner.id).off(listerner.event);
            });
            this.listeners = [];
            this.messages = [];
            // if (this.channel !== null) {
            //     const ref = this.getMessagesRef();
            //     ref.child(this.channel.id).off();
            // }
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
.channel-name {
    background-color: #3f3e3f;
    position: relative;
    z-index: 999;
}
</style>
