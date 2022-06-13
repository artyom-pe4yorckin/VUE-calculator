<template>
  <div class="calculator">
    <div class="input">
      <div class="equation-inputs">
        <div class="expression">
          <textarea spellcheck="false"
                    rows="1"
                    class="expression_txt"></textarea>
          <pre class="expression_highlighting"></pre>
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
          <button class="number-btn" data-value="1">1</button>
          <button class="number-btn" data-value="2">2</button>
          <button class="number-btn" data-value="3">3</button>
          <button class="number-btn" data-value="4">4</button>
          <button class="number-btn" data-value="5">5</button>
          <button class="number-btn" data-value="6">6</button>
          <button class="number-btn" data-value="7">7</button>
          <button class="number-btn" data-value="8">8</button>
          <button class="number-btn" data-value="9">9</button>
          <button class="number-btn" data-value="0">0</button>
          <button class="operator-btn" data-value=".">.</button>
          <button class="operator-btn" data-value="()">(...)</button>
          <button class="operator-btn" data-value="backspace" v-html="icons.backspace"></button>
        </div>
        <div class="operators">
          <dropdownList title="Арифметика">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" data-value="+" v-html="icons.plus"></button>
                <button class="operator-btn" data-value="-" v-html="icons.minus"></button>
                <button class="operator-btn" data-value="*" v-html="icons.multiply"></button>
                <button class="operator-btn" data-value="/" v-html="icons.division"></button>
                <button class="operator-btn" data-value="^" v-html="icons.exponentiation"></button>
                <button class="operator-btn" data-value="root(,)" v-html="icons.root"></button>
                <button class="operator-btn" data-value="!">!</button>
              </div>
            </div>
          </dropdownList>
          <dropdownList title="Тригонометрия">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" data-value="sin()">sin</button>
                <button class="operator-btn" data-value="cos()">cos</button>
                <button class="operator-btn" data-value="tg()">tg</button>
                <button class="operator-btn" data-value="ctg()">ctg</button>
              </div>
            </div>
          </dropdownList>
          <dropdownList title="Константы">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" data-value="pi">π</button>
                <button class="operator-btn" data-value="e">e</button>
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

<!--Можно сделать отдельный файл стилей и указать в атрибуте src тега ссылку на него-->
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
      equationInput: '',
      highlightingTxt:''
    };
  },
  name: "App",
  components: {
    dropdownList
  },
  methods: {
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
    }
  },
  //Работает только с простыми занчениями типа строк, чтобы отслеживать массивы/объекты надо указать в них конкретный индекс
  watch: {

  },
  //Выполняется когда всё смонтировано
  mounted: function() {
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
<style></style>
