<template>
    <div>
        <div class="messageForm">
            <form @submit.prevent="sendMessage">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text mt-3">></span>
                    </div>
                    <input
                        type="text"
                        name="message"
                        id="message"
                        class="form-control mt-3"
                        placeholder="Don't be shy wirte something..."
                        v-model="message"
                    />
                    <div class="input-group-append">
                        <button
                            type="button"
                            class="btn btn-primary mt-3"
                            @click="sendMessage"
                        >
                            &nbsp; Send &nbsp;
                        </button>
                    </div>
                    <div class="input-group-append">
                        <button type="button" class="btn btn-warning mt-3">
                            Upload
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "message-form",
    data() {
        return {
            message: "",
            erros: [],
        };
    },
    computed: {
        ...mapGetters(["getCurrentUser", "getCurrentChannel", "isPrivate"]),
    },
    methods: {
        sendMessage() {
            // Construct message object
            const newMessage = {
                content: this.message.trim(),
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    name: this.getCurrentUser.displayName,
                    avatar: this.getCurrentUser.photoURL,
                    id: this.getCurrentUser.uid,
                },
            };
            // Validation before pushing message
            if (this.getCurrentChannel !== null && this.message.length > 0) {
                this.$parent.getMessagesRef()
                    .child(this.getCurrentChannel.id)
                    .push()
                    .set(newMessage)
                    .then(() => {
                        this.message = "";
                        this.$nextTick(() => {
                            this.scrollToLastMessage();
                        });
                    })
                    .catch((err) => {
                        this.errors = err;
                    });
            }
        },
        scrollToLastMessage() {
            var innerContainer = document.querySelector(
                ".inner-messages-container"
            );
            innerContainer.scrollTop = innerContainer.scrollHeight;
        },
    },
};
</script>

<style scoped>
.messageForm {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
}
@media (min-width: 768px) {
    .messageForm {
        left: 25%;
    }
    input:focus,
    button:active,
    button:focus {
        box-shadow: unset;
    }
}
</style>
