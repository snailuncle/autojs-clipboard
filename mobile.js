// setClip("1111111111111111111111111111111111");
// setTimeout(() => {
//   setClip("22222222222222222222");
// }, 1000);

importClass(android.content.ClipboardManager);
const IPAddressOfYourComputer = "192.168.101.4";
const PORT = 7101;
var clipboard = context.getSystemService(context.CLIPBOARD_SERVICE);
var Listener = new ClipboardManager.OnPrimaryClipChangedListener({
  onPrimaryClipChanged: function () {
    let value = getClip();
    if (value) {
      let url = "http://" + IPAddressOfYourComputer + ":" + PORT + "?clipboard=" + value;
      log(url);
      http.get(url, {}, function (res, err) {
        if (err) {
          console.error(err);
          return;
        }
        log(res.body.string());
      });
    }
  },
});
clipboard.addPrimaryClipChangedListener(Listener);
// while (engines.all().length > 1) {
//   clipboard.removePrimaryClipChangedListener(Listener);
//   sleep(1000);
// }
events.on("exit", function () {
  clipboard.removePrimaryClipChangedListener(Listener);
});

setInterval(() => {}, 1000);
