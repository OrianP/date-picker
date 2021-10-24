// get number of week within the year for specific day
function getWeekNumber(date) {
    // first day of current year
    const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
    // how many days have passed since the first day of the year and the current date
    // deduct current date from first day of year in milliseconds and divide by a day represented in milliseconds
    const pastDaysOfTheYear = (date - firstDayOfTheYear) / 86400000;
    // add the number of passed days to the first day and divide by number of days in a week 
    // round up to return the number of the current week of the year
    return Math.ceil((pastDaysOfTheYear + firstDayOfTheYear.getDay() + 1) / 7);
}

function isLeapYear(year) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

// day class - smallest unit of calendar
class Day {             
    constructor(date = null, lang = 'default') {
        date = date ?? new Date();
        this.Date = date; // i.e Sat Oct 23 2021 11:48:57 GMT+0100 (British Summer Time)
        this.date = date.getDate(); // 23
        this.day = date.toLocaleString(lang, {weekday:'long'}); // 'Saturday'
        // weekday as numbers from 0-6 , 0 is Sunday so add 1 to make it the first day of the week
        this.dayNumber = date.getDay() + 1; 
        this.dayShort = date.toLocaleString(lang, {weekday:'short'});
        this.year = date.getFullYear();
        this.yearShort = Number(date.toLocaleString(lang, {year:'2-digit'}));
        this.month = date.toLocaleString(lang, {month:'long'});
        this.monthShort = date.toLocaleString(lang, {month:'short'});
        this.monthNumber = Number(date.toLocaleString(lang, {month: '2-digit'}));
        this.timestamp = date.getTime();
        this.week = getWeekNumber(date);
    }
    // pass today's date into isEqualTo method and return true or false
    get isToday() {
        return this.isEqualTo(new Date());
    }

    // check if the date passed in is equal to today (this Day class instance)
    isEqualTo(date) {
        date = date instanceof Day ? date.Date : date;
        return date.getDate() === this.date && 
        date.getMonth() === this.monthNumber - 1 && 
        date.getFullYear() === this.year;
    }

// use regex to replace formatStr according to formtStr passed in 
// stretch goal: add 'Do' regex to display the day appended by 'st', 'nd', 'ith', 'th'
    format(formatStr) {
        return formatStr
        .replace(/\bYYYY\b/, this.year)
        .replace(/\bYYY\b/, this.yearShort)
        .replace(/\bWW\b/, this.week.toString().padStart(2, '0'))
        .replace(/\bW\b/, this.week)
        .replace(/\bDDDD\b/, this.day)
        .replace(/\bDDD\b/, this.dayShort)
        .replace(/\bDD\b/, this.date.toString().padStart(2, '0'))
        .replace(/\bD\b/, this.date)
        .replace(/\bMMMM\b/, this.month)
        .replace(/\bMMM\b/, this.monthShort)
        .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
        .replace(/\bM\b/, this.monthNumber)
}
}

class Month {
    constructor(date =  null, lang = 'default') {
        const day = new Day(null, lang);
        const monthSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.lang = lang;
        this.name = day.month; // 'October'
        this.number = day.monthNumber; // 10 
        this.year = day.year; // 2021
        this.numberOfDays = monthSize[this.number - 1];

        if (this.number === 2) {
            this.numberOfDays += isLeapYear(day.year) ? 1 : 0;
        }

        // specify an iterator function for the month object to yield each day of the month as a Day object instance
        this[Symbol.iterator] = function* () {
            let number = 1; // first day of month
            while(number <= this.numberOfDays) {
                yield this.createDay(number)
                number++;
            }
        }
    }

    createDay(date){
        // months in js are zero-indexed (i.e October = 9) which is why this.number is subtracted by 1 to create the correct day instance 
        return new Day(new Date(this.year, this.number - 1, date), this.lang);
    }
}

const day = new Day();
const month = new Month();
console.log(month, [...month]);
// console.log('--day', day.format('MMM DD (DDDD/WW) YYYY'))
