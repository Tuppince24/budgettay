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
    console.log("Broke boy! " + e.target.errorCode);
};

function saveRecord(r) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.ObjectStore("pending");

    store.add(r);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.ObjectStore("pending")
    const getALL = store.getALL();

    getALL.onsuccess = function() {
        if(getALL.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getALL.result),
                headers: {
                    Accept: "application/json, */*, text/plain",
                    "content-type": "application/json"
                }
            })
            .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.ObjectStore("pending");
                    store.clear();
                });
        }
    }
}