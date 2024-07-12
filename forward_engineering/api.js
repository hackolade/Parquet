var Q=Object.defineProperty;var r=(e,t)=>Q(e,"name",{value:t,configurable:!0});var c=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var f=c((je,F)=>{var X=r(e=>e.entities.map(t=>JSON.parse(e.jsonSchema[t])),"getJsonSchemasFromInitialData");F.exports=X});var y=c((Ie,S)=>{var Z=r((e,t)=>({modelDefinitions:JSON.parse(e.modelDefinitions).properties,externalDefinitions:JSON.parse(e.externalDefinitions).properties,internalDefinitions:t.definitions}),"getDefinitionsFromInitialData");S.exports=Z});var T=c(($e,D)=>{var B=r((e=[])=>t=>e.reduce((n,s)=>s(n),t),"pipe");D.exports=B});var E=c((Me,x)=>{var ee=r((e,t)=>{if(!t)return e;let n=t.split(`
`),[s]=n.slice(0,1),[i]=n.slice(-1),a=n.slice(1,n.length-1);return a.length?[s,a.join(`
`),e,i].join(`
`):[s,e,i].join(`
`)},"wrapFieldWithParent");x.exports=ee});var N=c((Je,q)=>{var te="\xA0",re=r(e=>t=>t.split(`
`).map(n=>ne(n,e)).join(`
`),"prependFieldWithSpaces"),ne=r((e,t)=>{let n="";for(let s=0;s<t;s++)n+=te;return n+e},"prependStringWithSpaces");q.exports=re});var P=c((_e,O)=>{var se=r(e=>e.repetition,"getRepetition"),ie=r(e=>e.name,"getName"),oe=r(e=>{let{type:t,physicalType:n}=e;if(n)return n;switch(t){case"list":case"map":return"group";case"int":return`int${e.bitWidth}`;default:return t}},"getType"),ce=r(e=>{let{type:t,logicalType:n}=e;return t==="list"?"(LIST)":t==="map"?"(MAP)":n?`(${n})`:""},"getLogicalType"),ae=r(e=>[se(e),oe(e),ie(e),ce(e)].join(" ").trim(),"transformFieldToDremelString");O.exports=ae});var C=c((be,j)=>{var pe=r(e=>e.properties&&Object.values(e.properties).length>0||e.patternProperties&&Object.values(e.patternProperties).length>0||e.items,"hasFieldChild");j.exports=pe});var L=c((Ue,I)=>{var le=r(e=>{let{items:t,properties:n,patternProperties:s}=e;return n||s?{...n,...s}:t&&Array.isArray(t)?t.reduce((i,a,p)=>({...i,[`[${p}]`]:a}),{}):{element:t}},"getChildren"),ue=r(e=>{let t=le(e);return e.type==="list"?{list:{type:"group",repetition:"repeated",properties:t}}:e.type==="map"?{key_value:{type:"group",logicalType:"MAP_KEY_VALUE",repetition:"repeated",properties:t}}:t},"getFieldChildren");I.exports=ue});var A=c((Re,$)=>{var me=r(e=>e.$ref.indexOf("#model/")===0,"isModelDef"),de=r(e=>e.$ref.indexOf("#/")===0,"isInternalDef"),u=r(e=>e.$ref.split("/").slice(-1)[0],"getName"),ge=r(({internalDefinitions:e,modelDefinitions:t,externalDefinitions:n})=>s=>me(s)?t[u(s)]:de(s)?e[u(s)]:n[u(s)],"getFieldDefinition");$.exports=ge});var w=c((Ke,M)=>{var he=r(e=>{let t={...e};return delete t.properties,delete t.patternProperties,delete t.items,t},"removeChildrenFromField");M.exports=he});var K=c((Ye,G)=>{var J=T(),W=E(),Fe=N(),_=P(),v=C(),b=L(),fe=A(),Se=w(),k=2,m="header",d="nested field",U="single field",ye=r((e,t)=>!t&&e.title?m:v(e)?d:U,"defineFieldType"),De=r(e=>`message ${e.title} {
}`,"transformHeader"),Te=r(e=>`${_(e)} {
}`,"transformNestedField"),xe=r(e=>`${_(e)};`,"transformSingleField"),H=r(e=>t=>{switch(e){case m:return De(t);case d:return Te(t);case U:return xe(t);default:return""}},"transformFieldByType"),Ee=r(e=>t=>({...t,name:e}),"setName"),qe=r(e=>!!e.$ref,"isDefinition"),R=r(e=>(t,n=0,s=null)=>Object.entries(t).reduce((i,[a,p])=>{let l=J([o=>qe(o)?e(o):o,o=>o.physicalType?Se(o):o,o=>o.physicalType?{...o,logicalType:"UTF8"}:o])(p),g=ye(l,s),h=J([Ee(a),H(g),Fe(n)])(l);if(g!==d)return W(h,i);let z=b(l);return W(R(e)(z,n+k,h),i)},s),"transformFields"),Ne=r((e,t)=>{let n=H(m)(e);if(!v(e))return n;let s=fe(t),i=b(e);return R(s)(i,k,n)},"transformSchema");G.exports={transformSchema:Ne}});var Oe=f(),V=y(),Y=K();module.exports={generateScript(e,t,n){try{let s=JSON.parse(e.jsonSchema),i=Y.transformSchema(s,V(e,s));n(null,i)}catch(s){let i={message:s.message,stack:s.stack};t.log("error",i,"Parquet Forward-Engineering Error"),n(i)}},generateContainerScript(e,t,n){try{let i=Oe(e).map(a=>Y.transformSchema(a,V(e,a)));n(null,i.join(`

=====================

`))}catch(s){let i={message:s.message,stack:s.stack};t.log("error",i,"Parquet Forward-Engineering Error"),n(i)}}};
