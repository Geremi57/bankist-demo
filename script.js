'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Geremi wanga',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  // movements = '';
  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice(0).sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov < 0 ? 'withdrawal' : 'deposit';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance}€ `;
};

const calcDisplaySummary =
  //calculating incomes
  function (acc) {
    const incomes = acc.movements
      .filter((mov, i, arr) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}€ `;

    //calculating payments
    const outGoing = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(outGoing)}€ `;

    //calculating interests
    const interest = acc.movements
      .filter(mov => mov > 0)
      .map(mov => (mov * acc.interestRate) / 100)
      .filter((int, i, arr) => {
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);

    labelSumInterest.textContent = `${interest}€ `;
  };

// console.log(calcDisplaySummary(account1.movements));

//create usernames
const createUserNames = function (accs) {
  accs.forEach(function (acc, count) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
  // return username;
};

createUserNames(accounts);
console.log(`Hey there👋😃 want to check out the accounts`);
let map;
const obj = function (user, pin) {
  this.user = user;
  this.pin = pin;
};
const arr = accounts.map(acc => (map = new obj(acc.userName, acc.pin)));
console.log(...Object.values(arr));

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  console.log(`psych money in there isn't real`.toUpperCase());

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

let currentAccount;
//event handlers
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  // console.log('login');
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //update UI
    updateUI(currentAccount);

    console.log('login');
  }
});

//transfer amount
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  // if(amount > 0 && )
  console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.userName
  ) {
    //doung the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log(`transfer valid`);

    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // const iclosePin = Number(inputClosePin.value);
  // const inputUser = inputCloseUsername.value;

  if (
    Number(inputClosePin.value) === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.userName
  ) {
    const indexOfAccoount = accounts.findIndex(
      acc => acc.pin === currentAccount.pin
    );
    // console.log(acc);

    //delete account
    accounts.splice(indexOfAccoount, 1);

    //hide ui
    containerApp.style.opacity = 0;

    //return welcome message
    labelWelcome.textContent = 'Log in to get started';
    console.log(indexOfAccoount);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  // console.log(accounts);
  // accounts.find(acc, function () {

  // console.log(indexOfAccoount);
  console.log(accounts);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
  }
  console.log(loanAmount);
  // inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
  // displayMovements(currentAccount.movements, false);
});

//1
const bankDepositSum = accounts
  .flatMap((curr, i) => curr.movements)
  .filter(curr => curr > 0)
  .reduce((acc, curr) => acc + curr, 0);

//2
const depositsAtLeastAThousand = accounts
  .flatMap(curr => curr.movements)
  .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);

//prefixes ++ operator
let a = 10;

//3
const { deposits, withdrawals } = accounts
  .flatMap(curr => curr.movements)
  .reduce(
    (sums, curr) => {
      // acc + curr;
      // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

// console.log();

//4
//this is a nice title  = This Is a Nice Title
const convertTitleCse = function (title) {
  const capitaliza = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'but', 'or', 'on', 'with', 'in', 'the'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitaliza(word)))
    .join(' ');

  return capitaliza(titleCase);
};

// console.log(convertTitleCse());
// console.log(exceptions);
