// ==UserScript==
// @name         ddb-my-campaign-stats
// @namespace    https://github.com/Weatwagon/ddb-character-sheet-campaign-info-enhancement
// @version      2.0.5
// @description  New campaing info side panel with expandable character stats
// @author       Weatwagon orignal project by Mivalsten
// @match        https://www.dndbeyond.com/profile/*/characters/*
// @license      MIT; https://github.com/Weatwagon/ddb-character-sheet-campaign-info-enhancement/blob/master/LICENSE
// @grant        none
// ==/UserScript==
//
var $ = window.jQuery;

class Character {
    constructor(name) {
        this.name = name;
    };
    get level() {
        var classes = this.iframe.find('.ct-character-tidbits__classes').text().split('/').map(function (i) { return parseInt(i.replace(/[^0-9]+/g, '')) });
        return classes.reduce((a, b) => a + b, 0);
    }
    get proficiency() {
        return Math.ceil(this.level / 4) + 1;
    }

    get id() {
        return this.name.replace(/[^0-9a-zA-Z]+/g, '');
    }

    get iframe() {
        return $(`#frame-${this.id}`).contents();
    }

    get ac() {
        return parseInt(this.iframe.find(".ct-armor-class-box__value").text());
    }

    get currentHP() {
        return parseInt(this.iframe.find(".ct-status-summary-mobile__hp-current").text());
    }

    get maxHP() {
        return parseInt(this.iframe.find(".ct-status-summary-mobile__hp-max").text());
    }

    get passivePerception() {
        var selector = ".ct-senses .ct-senses__callout:has(.ct-senses__callout-label:contains(Perception))";
        return parseInt(this.iframe.find(selector).find(".ct-senses__callout-value").text());
    }

    get passiveInsight() {
        var selector = ".ct-senses .ct-senses__callout:has(.ct-senses__callout-label:contains(Insight))";
        return parseInt(this.iframe.find(selector).find(".ct-senses__callout-value").text());
    }

    get passiveInvestigation() {
        var selector = ".ct-senses .ct-senses__callout:has(.ct-senses__callout-label:contains(Investigation))";
        return parseInt(this.iframe.find(selector).find(".ct-senses__callout-value").text());
    }

    get stats() {
        var stats = {};
        var iframe = this.iframe;
        iframe.find('.ct-ability-summary').each(function (index) {
            let name = $(this).find('.ct-ability-summary__abbr').text();
            stats[name] = {
                value: Math.max(
                    parseInt($(this).find('.ct-ability-summary__primary').text()),
                    parseInt($(this).find('.ct-ability-summary__secondary').text())
                ),
                modifier: Math.min(
                    parseInt($(this).find('.ct-ability-summary__primary').text()),
                    parseInt($(this).find('.ct-ability-summary__secondary').text())
                ),
                savingThrow: iframe.find(`.ct-saving-throws-summary__ability--${name} .ct-signed-number`).text()
            };
        });
        return stats;
    }

    get skills() {
        var skills = {};
        this.iframe.find('.ct-skills__item').each(function () {
            var name = $(this).children('.ct-skills__col--skill').text();
            var value = $(this).children('.ct-skills__col--modifier').text();
            skills[name] = value;
        });
        return skills;
    }
};


function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.id = "GM_addStyleBy8626";
      document.head.appendChild(style);
      return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
  
function appySytle(){
    GM_addStyle(
        `.float-right {        
            float:right;
        }`
    )    
    GM_addStyle(
        `.campaign-character-wrapper {
            margin-bottom: 20px;
        }`
    )
    GM_addStyle(
        `.campaign-character-card {
            border-left: 1px solid #d1cdca;
            border-right: 1px solid #d1cdca;
            border-top: 1px solid #d1cdca;
            background: #fff;
            position: relative;                        
        }`
    )
    
    GM_addStyle(
        `.campaign-character-card::after {
            content: '';
            display: block;
            position: absolute;
            bottom: -1px;
            left: -1px;
            right: -1px;
            height: 12px;
            background-image: url(https://raw.githubusercontent.com/Weatwagon/ddb-character-sheet-campaign-info-enhancement/master/ddb-borders-med.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;            
        }`
    )

    GM_addStyle(
        `.card-header {            
            padding: 0 5px;
        }`
    )
    GM_addStyle(
        `.card-footer {
            border-top: 1px solid #dedede;
            padding: 0 20px;
        }`
    )
    GM_addStyle(
        `.footer-links {
            height: 50px;   
            display: flex;                
        }`
    )
    GM_addStyle(
        `.links-item-view::before {
            background-image: url(https://raw.githubusercontent.com/Weatwagon/ddb-character-sheet-campaign-info-enhancement/master/sheet-icon-dark.svg?sanitize=true);
            content: '';
            height: 14px;
            width: 14px;
            display: inline-block;
            background-size: cover;
            margin-right: 3px;
        }`
    )
    GM_addStyle(
        `.links-item-view {
            color: #1b9af0;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-align-items: flex-start;
            -ms-flex-align: start;
            align-items: flex-start;
            text-transform: uppercase;
            font-family: "Roboto Condensed",Roboto,Helvetica,sans-serif;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            padding: 10px;
        }`
    )

    //hit bar
    GM_addStyle(
        `.health-bar {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            width: 200px;
            height: 28px;
            padding: 5px;
            background: #ddd;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            position: relative;
          }
        `
    )
    GM_addStyle(
        `.bar {
            background: hsl(120,100%,50%);
            width: 100%;
            height: 18px;
            position: relative;
            
            transition: width .5s linear;
        }
        `
    )
    GM_addStyle(
          `.hit {
            background: rgba(255,255,255,0.6);
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 0px;
            
            transition: width .5s linear;
          }
        `
    )
    
}

function getColor(value){
    //value from 0 to 1
    var hue=((value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

function observerAndApply(id,element, action, keepAlive = function(){return false;}){
    var mainPageNode = document.body; 
    
    var formElement = $(element);
    //The page changed. See if our element exists.
    if (formElement.length > 0) { //An element exists.             
        console.log(id+" Found element: "+element);
        action();//do the dom action              
    }else{
        // create an observer instance
        var observer = new MutationObserver(function(mutations) {        
            var formElement = $(element);
            //The page changed. See if our element exists.
            if (formElement.length > 0) { //An element exists.             
                console.log(id+" Observer found element: "+element);
                action();//do the dom action
                console.log(id + " Observer keep alive check " + keepAlive);
                if(!keepAlive()){
                    console.log("function succeeded: " +keepAlive());
                    observer.disconnect(); //stop observing      
                }
            }
        });    
        // configure the observer and start the instance.
        var observerConfig = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(mainPageNode, observerConfig); 
    }     
}

function prerender(character, index, value,  times) {
    if (!isNaN(character.ac)) { render(character, index, value); }
    else {
        times += 1;
        if (times < 80) { setTimeout(function () { prerender(character, index, value, times); }, 500); };
    }
}

function render(character, index, value) {
    var tableId = `character-details-${character.id}`;

    var prefix = '<div class="campaign-character-wrapper"><div class="campaign-character-card"><div class="card-header ct-campaign-pane__character">'
    var image = ''

    if(value.avatarUrl){
        image = `
            <div class="ct-campaign-pane__character-preview"
                style="background-image: url(&quot;`+ value.avatarUrl +`&quot;);">
            </div>
        `;
    }else{
        image = ` <div class="ct-campaign-pane__character-preview ct-campaign-pane__character-preview--none"></div>`;
    }

    var div = prefix + image + `       
        <div class="ct-campaign-pane__character-content">
            <div class="ct-campaign-pane__character-name"><span
                    class="ct-campaign-pane__character-name-text">`+ value.characterName +`</span></div>
            <div class="ct-campaign-pane__character-user">` + value.username + `</div>
        </div>
    </div>
    <div class="card-footer">
        
               
        <div class="footer-links">   
            <div style="
                position: relative;
                margin-right: 45px;
            ">
                <span  style="
                    position: absolute;
                    left: 9px;
                    top: 5px;
                    font-size: large;
                ">`+character.ac+`
                    <small style="
                        top: 16px;
                        font-size: 11px;
                        display: flex;
                        position: absolute;
                        left: 4px;
                    ">AC</small>
                </span>
                <img src="https://raw.githubusercontent.com/Weatwagon/ddb-character-sheet-campaign-info-enhancement/master/Shield-icon.png" 
                style="
                    height: 40px;
                    position: absolute;
                ">
            </div>
            
            <div id="health-bar-`+character.id+`" class="health-bar" data-total="`+character.maxHP+`" data-value="`+character.currentHP+`">
                <div style="
                    position: absolute;
                    z-index: 8;
                    width: 100%;
                    text-align: center;
                    /* margin: 10px; */
                ">
                    <span class="current-hp">`+character.currentHP+`</span>/
                    <span class="total-hp">`+character.maxHP+`</span>&nbsp;HP
                </div>
                <div class="bar">
                    <div class="hit"></div>
                </div>
            </div>
                      
            <a class="float-right links-item-view" id='stats-button-`+character.id+`'>Stats</a>                 
        </div>   
             
    </div>
    </div> <!-- end div for campaign character card --> 
    <div>
      <table class="stats-block" id="${tableId}" style="display:none;">
        <thead>
          <tr>
            <th></th>
            <th align="center">Value</th>
            <th align="center">Modifier</th>
            <th align="center">Saving throw</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    </div>
  `;

    var statRow = `
    <tr>
      <th>title</th>
      <td align="center">value</td>
      <td align="center">mod</td>
      <td align="center">save</td>
    </tr>
  `;

    var otherRow = `
    <tr>
      <th>name</th>
      <td align="center">value</td>
      <td></td><td></td>
    </tr>
  `;

    $('#mySideBar .ct-campaign-pane__characters').after(div);
    var footer = $(`#${tableId} > tbody:last-child`);
    for (var s in character.stats) {
        var text = statRow
            .replace("title", s.toUpperCase())
            .replace("value", character.stats[s].value)
            .replace("mod", character.stats[s].modifier)
            .replace("save", character.stats[s].savingThrow);
        footer.append(text);
    }

    otherInfo = {
        "Proficiency": `+${character.proficiency}`,
        "HP": `${character.currentHP} / ${character.maxHP}`,
        "AC": character.ac,
        "Passive Investigation": character.passiveInvestigation,
        "Passive Perception": character.passivePerception,
        "Passive Insight": character.passiveInsight
    }

    for (name in otherInfo) {
        footer.append(otherRow.replace("name", name).replace("value", otherInfo[name]));
    }

    $('#stats-button-'+character.id).click(function(){
        $('#'+tableId).toggle();
    });

    hBar = $('#health-bar-'+character.id);
    hBar.on('update:bar',setBar)
    hBar.trigger('update:bar',[0]);
    


}

function renderLeftCampaign(campaign) {
    // double check not adding element more than once, could be unecissary
    var formElement = $('#mySideBar');    
    if (formElement.length > 0) {           
        console.log("Self Found element: Compaing Panely mySideBar");
       return false;          
    }
    
    var leftSide = `
        <div class="ct-sidebar ct-sidebar--left ct-sidebar--visible" style="left: 5px; right: auto;">
            <div class="ct-sidebar__inner">
                <div class="ct-sidebar__controls"></div>
                <div class="ct-sidebar__pane">
                    <div class="ct-sidebar__pane-top"></div>
                    <div class="ct-sidebar__pane-gap ct-sidebar__pane-gap--top"></div>
                    <div class="ct-sidebar__pane-content">
                        <div id='mySideBar' class="ct-campaign-pane">
                            <div class="ct-sidebar__header ">
                                <div class="ct-sidebar__header-primary">
                                    <div class="ct-sidebar__heading ">Campaign</div>
                                </div>
                            </div>
                            <div class="ct-campaign-pane__name"><a class="ct-campaign-pane__name-link"
                                    href="` + campaign.link  +`">`+campaign.name +`</a></div>
                            <div class="ct-campaign-pane__description">
                                ` + campaign.description + `
                            </div>
                            <div class="ct-campaign-pane__dm"><span class="ct-campaign-pane__dm-label">DM:</span><span
                                    class="ct-campaign-pane__dm-user">`+ campaign.dmUsername +`</span></div>
                            <div class="ct-campaign-pane__characters">                                
                            </div>
                        </div>
                    </div>
                    <div class="ct-sidebar__pane-gap ct-sidebar__pane-gap--bottom"></div>
                    <div class="ct-sidebar__pane-bottom"></div>
                </div>
            </div>
        </div>   
    `;
    
    $('.ct-sidebar__mask').after(leftSide);   
}

function setBar(event, damage){    
    var hBar = $(this), 
      bar = hBar.find('.bar'),
      hit = hBar.find('.hit'),
      total = hBar.data('total'),
      value = hBar.data('value'),
      hpCurrent=hBar.find('.current-hp'),
      hpTotal=hBar.find('.total-hp');
    
    console.log("Setting bar ", hBar);     
    
    if (value < 0) {
      console.log("you dead, reset");
      return;
    }   
    
    var newValue = value - damage;    
    // calculate the percentage of the total width
    var barWidth = (newValue / total) * 100;
    var hitWidth = (damage / value) * 100 + "%";
    
    // show hit bar and set the width
    hit.css('width', hitWidth);
    hBar.data('value', newValue);
    
    setTimeout(function(){
      hit.css({'width': '0'});
      bar.css('width', barWidth + "%");

      //set color based on width
      bar.css('background',getColor(barWidth/100));

      //set text
      hpCurrent.text(newValue);

    }, 500);
        
    if( value < 0){
      console.log("DEAD");
    }
}

(function () {
    console.log("script from disk loaded!");
    appySytle();
    $('#site').after('<div id="iframeDiv" style="opacity: 0; position: absolute;"></div>'); //visibility: hidden;    
    // get json data from current character URL
    // TODO: make sure valid url for the /json call
    $.get(location.href + '/json', function (data) { console.log('Data Loaded', data); }, 'json').done(function (data) {
        // wait for page to render and add side pannel
        observerAndApply("Load Campaign Panel",'.ct-sidebar__mask',function(){
            renderLeftCampaign(data.character.campaign);
        });
       
        data.character.campaign.characters.each(function (value, index) {
            console.log("index", index);
            console.log("value", value);
            
            let name = value.characterName;
            let character = new Character(name);
            let newIframe = document.createElement('iframe');
            //after loading iframe, wait for a second to let JS create content.
            newIframe.onload = function(){prerender(character, index,value, 0)};
            newIframe.id = `frame-${character.id}`;
            newIframe.style = "position: absolute;"; //visibility: hidden;
            newIframe.width = 1000;
            newIframe.height = 1;
            newIframe.seamless = "";
            //newIframe.src = node.attr('href');
            newIframe.src = "https://dndbeyond.com/characters/" + value.characterId;
            document.body.appendChild(newIframe);
            $('#iframeDiv').append(newIframe);
        })
    });
})();
