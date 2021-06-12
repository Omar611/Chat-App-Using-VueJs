<template>
    <div>
        <div class="container-fluid">
            <div class="row" v-if="$store.state.currentUser">
                <div class="col-md-3 p-0">
                    <sidebar />
                </div>
                <div class="col-md-9 content">
                    <messages />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from "@/sidebar/Sidebar";
import messages from "@/messages/Messages";

export default {
    name: "chat",
    methods: {},
    components: {
        sidebar,
        messages,
    },
};
</script>

<style scoped>
.content {
  padding: 0;
}
</style>
