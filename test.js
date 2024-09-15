const a = Date.now();
let timeout = setTimeout(test, 3000);

async function test(){
  const b = Date.now();
  console.log(b - a);  // This will log the time difference in milliseconds
}
