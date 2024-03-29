export default function (...argv) {
  return {
    start: `
    Привіт! 👋🏻
Я — твій помічник у нагадуванні про вебінари та інші важливі події 👩🏼‍💻
Не вимикай сповіщення, щоб нічого не пропустити, адже тут буде лише важлива інформація 🤍
    `,
    adminSubGroup: `Привіт, ти викладач, за тобою закріпленна група: ${argv[0]} під группа ${argv[1]}`,
    adminGroup: `Привіт, ти викладач, за тобою закріпленна група: ${argv[0]}`,
    stop: 'Цю комнду досить визвати один раз 🤍',
    error:
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam',
    incorrectUser: 'Як ти дізнався про цю команду? 😳',
    messageSentIntoMainGroup: 'Повідомлення відправлене у вашу основну групу',
    writeYourTeacher: 'Напиши своєму куратору 🤍',
    groupNotFound: 'Груп поки немає',
    chooseYourGroup: `Тепер обери свою групу та підгрупу (за необхідності) 🤍
‼️ уважно слідуй вказівкам куратора ‼️`,
    enterNameOfGroup: 'Введи назву нової групи',
    ownGroupCreated: `Ваша власна група під назвою ${argv[0]} - створена`,
    messageSent: 'Повідомлення відправлене',
    enterNameNewGroup:'Введіть назву групи в якій потрібно створити  Викладача',
    enterNameNewSubGroup:'Введіть назву підгруппи в яку потріно додати Викладача',
    enterUsernameTeacher: 'Введіть username з телеграму викладача',
    groupChoosed: `Вы обрали групу ${argv[0]}`,
    subGroupChoosed: `Вы обрали під групу ${argv[0]}`,
    teacherChoosed: `Вы обрали Выкладача ${argv[0]}`,
    connectedToGroup: `Ти приєднався(-лась) до групи ${argv[0]}`,
    setAdminGroup: `Викладач ${argv[0]} закріпленний за групою ${argv[1]}
Всі наступні повідомлння будуть відправлятися учням`,
    setAdminSubGroup: `Викладач ${argv[0]} закріпленний за під групою ${argv[1]}
та підгрупою ${argv[2]}
Всі наступні повідомлння будуть відправлятися учням`,
    noHaveStudents: 'У цій групі поки немає студентів',
    authInfo: `Ваш код авторизації ${argv[0]} 
${argv[1]}`
  };
}
