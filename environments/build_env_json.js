const fs = require('fs');

let path = '';
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

console.log(process.argv[2]);
const build = process.argv[2];
 if (build === "admin"){
        path = "./env-admin.json";
 }
else if (build === "mod"){
     path = "./env-mod.json";
}
 else if (build === "dev"){
     path = "./env-dev.json";
 }
console.log(path);
try {
    const data = fs.readFileSync(path, 'utf8');
    const jsonData = JSON.parse(data);
   console.log(jsonData);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    jsonData['buildDate']  = mm + '_' + dd + '_' + yyyy;

    console.log("date appended: " + jsonData['buildDate']  );

    const jsonString = JSON.stringify(jsonData);
    fs.writeFile('./env.json', jsonString, (err) => {
        if (err) {
            console.error('An error occurred:', err);
        } else {
            console.log( build + ' env saved to env.json');
        }
    });

} catch (err) {
    console.error("An error occurred:", err);
}