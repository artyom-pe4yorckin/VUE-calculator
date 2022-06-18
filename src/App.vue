<template>
  <p>Выражения типа 1*(-2) не вычисляются</p>
  <div class="calculator">
    <div class="input">
      <div class="equation-inputs">
        <div class="expression">
          <textarea spellcheck="false"
                    rows="1"
                    class="expression_txt"
                    v-bind:class="{extraPadding:lastStrIsEmpty}"
                    v-on:keypress="validator($event)"
                    v-on:keydown.tab="tab"
                    v-on:click="updateCarriagePos()"
                    v-model="expression"></textarea>
          <!--extraPadding нужен т.к. первая строка выходит за вьюбокс текстареа, -->
          <pre class="expression_highlighting"
               v-bind:class="{extraPadding:lastStrIsEmpty}"
               v-html="highlightingHTML"></pre>
        </div>
        <dropdownList title="Конструктор" class="constructor">
          <div class="constructor_head tab-block">
            <div class="tab_title-list">
              <div v-on:click="openTab" class="constructor_tab-title" data-tab="arithmetic" v-html="icons['plus-minus']"></div>
              <div v-on:click="openTab" class="constructor_tab-title" data-tab="trigonometry" v-html="icons.trigonometry"></div>
              <div v-on:click="openTab" class="constructor_tab-title" data-tab="constants" v-html="icons.pi"></div>
            </div>
            <div class="tab_list">
              <div class="constructor_tab" data-tab="arithmetic">
                <div class="operation" v-html="icons.plus"></div>
                <div class="operation" v-html="icons.minus"></div>
                <div class="operation" v-html="icons.multiply"></div>
                <div class="operation" v-html="icons.division"></div>
                <div class="operation" v-html="icons.exponentiation"></div>
              </div>
              <div class="constructor_tab" data-tab="trigonometry">
                <div class="operation">sin</div>
                <div class="operation">cos</div>
                <div class="operation">tg</div>
                <div class="operation">ctg</div>
              </div>
              <div class="constructor_tab" data-tab="constants">
                <div class="operation">π</div>
                <div class="operation">e</div>
              </div>
            </div>
          </div>
          <div class="constructor_body"></div>
        </dropdownList>
      </div>
      <div class="buttons">
        <div class="numbers">
          <button class="number-btn" data-value="1" v-on:click="changeExpression">1</button>
          <button class="number-btn" data-value="2" v-on:click="changeExpression">2</button>
          <button class="number-btn" data-value="3" v-on:click="changeExpression">3</button>
          <button class="number-btn" data-value="4" v-on:click="changeExpression">4</button>
          <button class="number-btn" data-value="5" v-on:click="changeExpression">5</button>
          <button class="number-btn" data-value="6" v-on:click="changeExpression">6</button>
          <button class="number-btn" data-value="7" v-on:click="changeExpression">7</button>
          <button class="number-btn" data-value="8" v-on:click="changeExpression">8</button>
          <button class="number-btn" data-value="9" v-on:click="changeExpression">9</button>
          <button class="number-btn" data-value="0" v-on:click="changeExpression">0</button>
          <button class="operator-btn" data-value="." v-on:click="changeExpression">.</button>
          <button class="operator-btn" data-value="()" v-on:click="wrapInBrackets">(...)</button>
          <button class="operator-btn" data-value="backspace" v-on:click="changeExpression" v-html="icons.backspace"></button>
        </div>
        <div class="operators">
          <dropdownList title="Арифметика">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" v-on:click="changeExpression" data-value="+" v-html="icons.plus"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="-" v-html="icons.minus"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="*" v-html="icons.multiply"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="/" v-html="icons.division"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="^" v-html="icons.exponentiation"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="root(,)" v-html="icons.root"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="!">!</button>
              </div>
            </div>
          </dropdownList>
          <dropdownList title="Тригонометрия">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" v-on:click="changeExpression" data-value="sin()">sin</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="cos()">cos</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="tg()">tg</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="ctg()">ctg</button>
              </div>
            </div>
          </dropdownList>
          <dropdownList title="Константы">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" v-on:click="changeExpression" data-value="pi">π</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="e">e</button>
              </div>
            </div>
          </dropdownList>
        </div>
      </div>
    </div>

    <div class="output">
      <button class="calculate" v-html="icons.equals"></button>
      <p class="answer">{{ answer }}</p>
      <ol class="error-list">
        <li class="error-item">
          <div class="error-txt"></div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import dropdownList from '@/components/dropdown-list'

export default {
  data() {
    return {
      icons: {
        plus: '',
        minus: '',
        multiply: '',
        division: '',
        exponentiation: '',
        equals: '',
        backspace: '',
        root: '',
        'plus-minus': '',
        trigonometry: '',
        pi: ''
      },
      expression: '',
      answer: 0,
      expressionInput: '',
      highlightingHTML: '',
      carriagePos: 0,
      lastStrIsEmpty: false
    };
  },
  name: "App",
  components: {
    dropdownList
  },
  methods: {
    //проверка символа на допустимость (латиница, цифры, скобки, !, точка, табы и переносы строк)
    validator(e){
      let char = String.fromCharCode(e.keyCode);
      if(/[^^\/*+\-\da-zA-Z()!\.,]/.test(char) && e.keyCode!=13 && e.keyCode!=32){
        e.preventDefault()
      }else{
        //если нажат enter то последняя строка пустая
        this.lastStrIsEmpty = e.keyCode==13
      }
    },

    //переключение между табами в конструкторе
    openTab(e) {
      let elem = e.currentTarget
      let tabId = elem.getAttribute('data-tab')
      if(tabId){
        let tab = elem.closest('.tab-block')
        if(tab){
          let prevTab = tab.querySelector('.tab_list [data-tab].active')
          let prevTabTitle = tab.querySelector('.tab_title-list [data-tab].active')
          if(prevTab) prevTab.classList.remove('active')
          if(prevTabTitle) prevTabTitle.classList.remove('active')
          elem.classList.add('active')
          tab.querySelector(`.tab_list [data-tab="${tabId}"]`).classList.add('active')
        }
      }
    },

    //вставка отступа при нажатии на tab
    tab(e){
      // get caret position/selection
      let start = this.expressionInput.selectionStart;
      let end = this.expressionInput.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      this.expression = this.expression.substring(0, start) + "\t" + this.expression.substring(end);

      // put caret at right position again (add one for the tab)
      this.expressionInput.selectionStart = this.expressionInput.selectionEnd = start + 1;

      // prevent the focus lose
      e.preventDefault();
    },

    //Ввод по кнопкам
    changeExpression(e) {
      let currentThing = e.currentTarget.getAttribute("data-value")
      if(currentThing=="backspace"){
        this.lastStrIsEmpty = false
        this.expression = this.expression.substring(0, this.carriagePos-1) + this.expression.substring(this.carriagePos, this.expression.length)
        this.carriagePos--
      }else{
        this.expression = this.expression.substring(0, this.carriagePos) + currentThing + this.expression.substring(this.carriagePos, this.expression.length)
        this.carriagePos = this.carriagePos + currentThing.length
      }
    },

    updateCarriagePos(){
      this.carriagePos = this.expressionInput.selectionEnd
    },

    //Оборачивание в скобки по кнопке
    wrapInBrackets() {
      let txt = this.expression.split('')
      txt.splice(this.expressionInput.selectionStart, 0, "(")
      txt.splice(this.expressionInput.selectionEnd+1, 0, ")")
      this.expression = txt.join('')
    },

    //подсветка ошибок, пока просто обрачиваем каждый символ в span
    doHighlighting(){
      let expression = this.expression;
      let html = [];
      for(let char of expression){
        html.push(`<span>${char}</span>`)
      }
      this.highlightingHTML = html.join('')
    }
  },
  //Работает только с простыми занчениями типа строк, чтобы отслеживать массивы/объекты надо указать в них конкретный индекс
  watch: {
    expression(newVal, oldVal, e){
      this.doHighlighting()
    }
  },
  //Выполняется когда всё смонтировано
  mounted: function() {
    this.expressionInput = document.querySelector('.expression_txt')
    //получаем код svg иконок
    for (let i in this.icons) {
      try{
        let path = require(`@/assets/img/${i}.svg`)
        fetch(path).then(response=>{
          return response.text()
        }).then(data=>{
          this.icons[i] = data
        })
      }catch (error){
        console.error(error)
      }
    }

    //активируем первый таб у всех табов
    let tabs = document.querySelectorAll(".tab-block")
    for (let t of tabs) {
      let tabTitle = t.querySelector(".tab_title-list [data-tab]")
      if(tabTitle) tabTitle.click()
    }

    //Открываем первый выпадающий список в операторах
    document.querySelector(".operators>.dropdown-list .dropdown-list-title").click()
  }
};
</script>

<!--Можно сделать отдельный файл стилей и указать в атрибуте src тега ссылку на него-->
<style>
</style>
