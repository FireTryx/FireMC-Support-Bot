module.exports = async prefix => {

    let caracters = [..."1234567890"];
    let ID = [];
    for(let i = 0; i < 5; i++) ID.push(caracters[Math.floor(Math.random() * caracters.length)])

    return `${prefix}-${ID.join("")}`;
}