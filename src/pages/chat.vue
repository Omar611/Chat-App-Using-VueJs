<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3 p-4 sidebar">
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
.sidebar {
    height: 100vh;
    background-color: #1d1c1d;
    overflow: auto;
}
</style>
