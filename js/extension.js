document.body.onload = function(){
  // Get message from the message-msgInput
  var msgInput = document.getElementById('message-input');
  var msg = document.getElementById('userQuoteText');
  var share = document.getElementById('shareOptionContainer');
  msgInput.addEventListener('keypress', function(e){
    // Enter key pressed
   if (event.keyCode == 13 || event.which == 13){
     this.style.display = 'none';

     var message = msgInput.value.trim();
     if(message){
       msg.innerText = message;
       console.log('msg length' + msg.innerText.length);
       msg.style.display = 'block';
       var height = Math2.map(msg.innerText.length, 10, 80, 70, 110);
       createTree(height);

       // save the message value using the chrome extension storage API
       chrome.storage.sync.get(['messages'], function(results) {
         var messages = results.messages || [];
         messages.push(message);
         chrome.storage.sync.set({
           "messages": messages
         }, function() {
           console.log('saved these messages',messages);
         });

       });
     }else{
       console.error("No message");
     }
    }
  }, false);

  // Tracking changes made to a data object, by adding a listener to its onChanged
  // chrome.storage.onChanged.addEventListener(function(changes, namespace){
  //   for(key in changes){
  //     var storageChange = changes[key];
  //     console.log('Storage key "%s" in namespace "%s" changed. ' +
  //                       'Old value was "%s", new value is "%s".',
  //                       key,
  //                       namespace,
  //                       storageChange.oldValue,
  //                       storageChange.newValue);
  //   }
  // });
}
