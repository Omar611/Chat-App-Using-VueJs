<template>
    <div>
        <div class="inner-messages-container pt-5 mt-3">
            <div v-for="(message, index) in messages" :key="index">
                <div class="media">
                    <img
                        :src="message.user.avatar"
                        height="50"
                        alt="avatar"
                        class="mr-3"
                    />
                    <div class="media-body">
                        <h6 class="mt-0">
                            <a href="javascript.void(0)">{{
                                message.user.name
                            }}</a>
                            - {{ fromNow(message.timestamp) }}
                        </h6>
                        <p
                            :class="{
                                'self-message': selfMessage(message.user),
                            }"
                        >
                            {{ message.content }}
                        </p>
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
    },
};
</script>

<style scoped>
.inner-messages-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 100%;
    min-height: 97%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.inner-messages-container::-webkit-scrollbar-track {
  border: 1px solid #000;
  padding: 2px 0;
  background-color: #404040;
}
.inner-messages-container::-webkit-scrollbar {
  width: 10px;
}
.inner-messages-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #737272;
  border: 1px solid #000;
}
.self-message {
    border-left: 5px solid red;
    padding-left: 7px;
    color: green;
}
@media (max-width: 767px) {
    .inner-messages-container {
        bottom: 30px;
    }
}
</style>
