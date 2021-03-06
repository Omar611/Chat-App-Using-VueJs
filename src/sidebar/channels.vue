<template>
    <div>
        <div
            class="
                channels-header
                d-flex
                justify-content-center
                align-items-centerr
                flex-column
                mb-4
            "
        >
            <h3 class="channels-title text-center text-light my-2">Channels</h3>
            <button
                class="btn btn-outline-light my-2"
                data-toggle="modal"
                data-target="#channelModal"
            >
                Add Channel
            </button>
        </div>
        <!-- Modal -->
        <div
            class="modal fade"
            id="channelModal"
            tabindex="-1"
            aria-labelledby="channelModal"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-dark font-weight-bold">
                            Add New Channel
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="addChannel">
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="new_channel"
                                    id="newChannel"
                                    class="form-control"
                                    placeholder="Channel Name"
                                    v-model="new_channel"
                                />
                            </div>
                        </form>
                        <div v-if="hasErrors">
                            <div
                                class="
                                    alert alert-danger alert-dismissible
                                    fade
                                    show
                                "
                                role="alert"
                                v-for="error in errors"
                                :key="error"
                            >
                                <strong>{{ error }}</strong>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-light border border-dark"
                            data-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-dark"
                            @click="addChannel"
                        >
                            Add Cahnnel
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="channels-list">
            <div v-for="channel in channels" :key="channel.id">
                <a
                    class="
                        text-light
                        p-3
                        d-block
                        text-decoration-none
                        chat-channel
                        border
                    "
                    :class="{ 'bg-light text-dark': setActiveChannel(channel) }"
                    @click="changeChannel(channel)"
                >
                    <h5 class="m-0">
                        # {{ channel.name }}
                        <span
                            class="badge badge-light float-right"
                            v-if="
                                getNotification(channel) &&
                                channel.id != getCurrentChannel.id
                            "
                            >{{ getNotification(channel) }}</span
                        >
                    </h5>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import databse from "firebase/database";
import { mapGetters } from "vuex";
import mixin from "@/mixins";

export default {
    name: "channel",
    data() {
        return {
            new_channel: "",
            errors: [],
            channelsRef: firebase.database().ref("channels"),
            messagesRef: firebase.database().ref("messages"),
            notifCount: [],
            channels: [],
            currentChannel: null,
        };
    },
    mixins: [mixin],
    computed: {
        hasErrors() {
            return this.errors.length > 0;
        },
        ...mapGetters(["getCurrentChannel", "isPrivate"]),
    },
    watch: {
        isPrivate() {
            if (this.isPrivate) {
                this.resetNotifications();
            }
        },
    },
    methods: {
        addChannel() {
            this.errors = [];
            // Get key to the newly created channel
            const key = this.channelsRef.push().key;
            if (!this.new_channel) {
                this.errors.push("Channel name is required");
                return;
            }
            // Create new channel
            const newChannel = {
                id: key,
                name: this.new_channel,
            };
            this.new_channel;
            // Push the channel to firebase
            this.channelsRef
                .child(key)
                .update(newChannel)
                .then((res) => {
                    this.new_channel = "";
                    $("#channelModal").modal("hide");
                });
            // .catch((err) => this.errors.push(err.message));
        },
        addListeners() {
            let i = 0;
            this.channelsRef.on("child_added", (snapshot) => {
                this.channels.push(snapshot.val());
                if (this.channels.length > 0 && i == 0) {
                    this.currentChannel = this.channels[0];
                    this.$store.dispatch(
                        "setCurrentChannel",
                        this.currentChannel
                    );
                    i++;
                }
                // Add count listener to notifications
                this.addCountListener(snapshot.key);
            });
        },
        detachListeners() {
            this.channelsRef.off();
            this.channels.forEach((ch) => {
                this.messagesRef.child(ch.id).off();
            });
        },
        setActiveChannel(ch) {
            return ch.id === this.getCurrentChannel.id;
        },
        changeChannel(channel) {
            this.currentChannel = channel;
            this.$store.dispatch("setPrivate", false);
            this.$store.dispatch("setCurrentChannel", this.currentChannel);

            // Reset notifications
            this.resetNotifications();
        },
        resetNotifications() {
            const index = this.notifCount.findIndex(
                (el) => el.id == this.currentChannel.id
            );
            if (index !== -1) {
                this.notifCount[index].total =
                    this.notifCount[index].lastKnownTotal;
                this.notifCount[index].notif = 0;
            }
        },
        addCountListener(channelId) {
            this.messagesRef.child(channelId).on("value", (snapshot) => {
                this.handelNotifications(
                    channelId,
                    this.getCurrentChannel.id,
                    this.notifCount,
                    snapshot
                );
            });
        },
        getNotification(channel) {
            let notif = 0;
            this.notifCount.forEach((el) => {
                if (el.id == channel.id) {
                    notif = el.notif;
                }
            });
            return notif;
        },
    },
    mounted() {
        this.addListeners();
    },
    beforeDestroy() {
        this.detachListeners();
    },
};
</script>

<style scoped>
.chat-channel {
    cursor: pointer;
}
.channels-list > div:nth-child(1) > a {
    border-radius: 5px 5px 0 0;
}
.channels-list > div:last-child > a {
    border-radius: 0 0 5px 5px;
}
/* @media (max-width: 1024px) {
    .channels-header {
        flex-direction: column;
    }
    .channels-title {
      text-align: center;
    }
} */
</style>
