const { Client } = require("@notionhq/client")
const EcoleDirecte = require("@asgarrrr/ecoledirecteapi");
require('dotenv').config()

const notion = new Client({
    auth: process.env.NOTION_AUTH
});

;(async () => {
    const session = new EcoleDirecte.Session();
    const account = await session.login(process.env.ED_USERNAME, process.env.ED_PASSWORD)

    account.getSchedule().then(courses => {
        courses.forEach(course => {
            add(course.text, course.prof, course.salle, new Date(course.start_date), new Date(course.end_date))
        })
    })

})();

async function add(course, teacher, room, startDate, endDate) {
    let name = await notion.users.me()
    name = name.name
    const response = await notion.pages.create({
        parent: {
          database_id: process.env.DATABASE_ID,
        },
        properties: {
          Cours: { title: [ { text: { content: course } } ] },
          Professeur: { rich_text: [ { text: { content: teacher } } ] },
          Salle: { rich_text: [ { text: { content: room } } ] },
          Date: { date: { start: startDate, end: endDate } },
          Description: { rich_text: [ { text: { content: `Automatically added by ${name} the ${new Date()}` } } ] }
        },
    });
}
