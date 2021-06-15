export default {
  methods: {
    handelNotifications(channelId, currentChannelId, notifCount, snapshot) {
      let lastTotal = 0;
      // Find if channelId is in notifCount array
      const index = notifCount.findIndex((el) => el.id == channelId);

      // Check if index found and if current channel is not the notification channel
      if (index != -1 && channelId != currentChannelId) {
        lastTotal = notifCount[index].total;
        if (snapshot.numChildren() - lastTotal > 0) {
          notifCount[index].notif =
            snapshot.numChildren() - lastTotal;
        }
        notifCount[index].lastKnownTotal = snapshot.numChildren();
      } else {
        notifCount.push({
          id: channelId,
          total: snapshot.numChildren(),
          lastKnownTotal: snapshot.numChildren(),
          notif: 0,
        });
      }
    },
  },
}
