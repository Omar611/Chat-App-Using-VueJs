<template>
    <div>
        <div class="inner-messages-container pt-5 px-3 mt-3">
            <div v-for="(message, index) in messages" :key="index">
                <div class="media mb-3 p-1 rounded">
                    <img
                        :src="message.user.avatar"
                        height="50"
                        alt="avatar"
                        class="mr-3"
                    />
                    <div class="media-body">
                        <h6 class="mt-0">
                            <a
                                href="#"
                                @click.prevent="changeChannel(message.user)"
                                v-if="!selfMessage(message.user)"
                                >{{ message.user.name }}</a
                            >
                            <p class="m-0 d-inline-block text-primary" v-else>
                                {{ message.user.name }}
                            </p>
                            - {{ fromNow(message.timestamp) }}
                        </h6>
                        <p
                            v-if="!isFile(message)"
                            class="m-0"
                            :class="{
                                'self-message': selfMessage(message.user),
                            }"
                        >
                            {{ message.content }}
                        </p>
                        <img
                            v-else
                            :src="message.image"
                            :class="{
                                'self-message': selfMessage(message.user),
                            }"
                            class="img img-responsive chat-img pl-2"
                            alt="image"
                        />
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
    name: "single-message",
    props: ["messages"],
    computed: {
        ...mapGetters(["getCurrentUser"]),
    },
    methods: {
        fromNow(value) {
            return moment(value).fromNow(true);
        },
        selfMessage(user) {
            return user.id === this.getCurrentUser.uid;
        },
        isFile(message) {
            return message.content == null && message.image != null;
        },
        getChannelID(userId) {
            return userId < this.getCurrentUser.uid
                ? userId + "/" + this.getCurrentUser.uid
                : this.getCurrentUser.uid + "/" + userId;
        },
        changeChannel(user) {
            const chanhelId = this.getChannelID(user.id);
            const channel = { id: chanhelId, name: user.name };
            this.$store.dispatch("setPrivate", true);
            this.$store.dispatch("setCurrentChannel", channel);
        },
    },
};
</script>

<style scoped>
.inner-messages-container {
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    max-height: 95%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.inner-messages-container::-webkit-scrollbar-track {
    border: 1px solid #000;
    padding: 2px 0;
    background-color: #404040;
}
.inner-messages-container::-webkit-scrollbar {
    width: 15px;
}
.inner-messages-container::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #737272;
    border: 1px solid #000;
}
.media {
    background: #fff;
}
.self-message {
    border-left: 5px solid red;
    padding-left: 7px;
    color: green;
}
.chat-img {
    height: 300px;
    width: auto;
    max-width: 100%;
}
@media (max-width: 767px) {
    .inner-messages-container {
        bottom: 30px;
    }
    .chat-img {
        height: auto;
        width: auto;
        max-width: 100%;
    }
}
</style>
