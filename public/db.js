let db 
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = function(e){
    db = e.target.request

    if(navigator.onLine){
        checkDatabase();
    }
};

request.onerror = function(e) {
    console.log()
}