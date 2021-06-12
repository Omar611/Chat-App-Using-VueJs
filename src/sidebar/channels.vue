<template>
    <div>
        <div class="d-flex justify-content-center align-items-centerr mb-4">
            <h3 class="text-light m-2 border-bottom">Channels</h3>
            <button
                class="btn btn-outline-light m-2"
                data-toggle="modal"
                data-target="#channelModal"
            >
                Add Channel
            </button>
        </div>
        <div v-if="hasErrors">
            <div
                class="alert alert-danger alert-dismissible fade show"
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
                        <form>
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
                    <h5 class="m-0"># {{ channel.name }}</h5>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import databse from "firebase/database";
import { mapGetters } from "vuex";

export default {
    name: "channel",
    data() {
        return {
            new_channel: "",
            errors: [],
            channelsRef: firebase.database().ref("channels"),
            channels: [],
            currentChannel: null,
        };
    },
    computed: {
        hasErrors() {
            return this.errors.length > 0;
        },
        ...mapGetters(["getCurrentChannel"]),
    },
    methods: {
        addChannel() {
            this.errors = [];
            // Get key to the newly created channel
            const key = this.channelsRef.push().key;
            // Create new channel
            const newChannel = {
                id: key,
                name: this.new_channel,
            };
            // Push the channel to firebase
            this.channelsRef
                .child(key)
                .update(newChannel)
                .then((res) => {
                    this.new_channel = "";
                    $("#channelModal").modal("hide");
                })
                .catch((err) => this.errors.push(err.message));
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
            });
        },
        detachListeners() {
            this.channelsRef.off();
        },
        setActiveChannel(ch) {
            return ch.id === this.getCurrentChannel.id;
        },
        changeChannel(channel) {
            this.currentChannel = channel;
            this.$store.dispatch("setPrivate", false);
            this.$store.dispatch("setCurrentChannel", this.currentChannel);
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
</style>
