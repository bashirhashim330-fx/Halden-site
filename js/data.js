/* Single source of truth for products and sample store settings. */
window.HAL = window.HAL || {};
HAL.products = [
  { id:'azure', code:'H-01', name:'Azure', title:'Gold, blue dial', price:4200,
    metal:'Gold', dial:'Blue', strap:'Bracelet', strapNote:'Gold bracelet',
    desc:'A round gold watch with a deep blue sunburst dial, slim gold markers and a solid gold bracelet.',
    specs:[['Model number','H-01'],['Case','Gold, round'],['Dial','Blue sunburst'],['Strap','Gold bracelet'],['Case diameter','40 mm (sample)'],['Movement','Automatic (sample)'],['Water resistance','50 m (sample)']],
    img:{ alone:'assets/img/watch-azure.webp', box:'assets/img/box-azure.webp', dial:'assets/img/dial-azure.webp' },
    anim:{ pv:[548,606], mc:[836,470], mr:540, bp:[548,684], br:135, r:290 } },
  { id:'cocoa', code:'H-02', name:'Cocoa', title:'Rose gold, brown dial', price:3600,
    metal:'Rose gold', dial:'Brown', strap:'Leather', strapNote:'Brown leather strap',
    desc:'A rose gold watch with a warm brown sunburst dial, slim rose gold hands and a brown leather strap.',
    specs:[['Model number','H-02'],['Case','Rose gold, round'],['Dial','Brown sunburst'],['Strap','Brown leather'],['Case diameter','38 mm (sample)'],['Movement','Automatic (sample)'],['Water resistance','30 m (sample)']],
    img:{ alone:'assets/img/watch-cocoa.webp', box:'assets/img/box-cocoa.webp', dial:'assets/img/dial-cocoa.webp' },
    anim:{ pv:[548,632], mc:[826,466], mr:608, bp:[563,704], br:153, r:279 } },
  { id:'onyx', code:'H-03', name:'Onyx', title:'Steel, black dial', price:2400,
    metal:'Steel', dial:'Black', strap:'Leather', strapNote:'Black leather strap',
    desc:'A polished steel watch with a black sunburst dial, silver markers and a black leather strap.',
    specs:[['Model number','H-03'],['Case','Steel, round'],['Dial','Black sunburst'],['Strap','Black leather'],['Case diameter','38 mm (sample)'],['Movement','Quartz (sample)'],['Water resistance','30 m (sample)']],
    img:{ alone:'assets/img/watch-onyx.webp', box:'assets/img/box-onyx.webp', dial:'assets/img/dial-onyx.webp' },
    anim:{ pv:[551,629], mc:[830,467], mr:558, bp:[551,726], br:159, r:285 } },
  { id:'verde', code:'H-04', name:'Verde', title:'Gold, champagne dial', price:3200,
    metal:'Gold', dial:'Champagne', strap:'Leather', strapNote:'Green leather strap',
    desc:'A gold watch with a champagne sunburst dial, slim gold markers and a deep green leather strap.',
    specs:[['Model number','H-04'],['Case','Gold, round'],['Dial','Champagne sunburst'],['Strap','Green leather'],['Case diameter','36 mm (sample)'],['Movement','Automatic (sample)'],['Water resistance','30 m (sample)']],
    img:{ alone:'assets/img/watch-verde.webp', box:'assets/img/box-verde.webp', dial:'assets/img/dial-verde.webp' },
    anim:{ pv:[551,634], mc:[829,470], mr:506, bp:[552,706], br:146, r:281 } },
  { id:'ivory', code:'H-05', name:'Ivory', title:'Steel, ivory dial', price:2800,
    metal:'Steel', dial:'Ivory', strap:'Bracelet', strapNote:'Steel bracelet',
    desc:'A polished steel watch with an ivory sunburst dial, slim steel markers and a steel bracelet.',
    specs:[['Model number','H-05'],['Case','Steel, round'],['Dial','Ivory sunburst'],['Strap','Steel bracelet'],['Case diameter','38 mm (sample)'],['Movement','Automatic (sample)'],['Water resistance','50 m (sample)']],
    img:{ alone:'assets/img/watch-ivory.webp', box:'assets/img/box-ivory.webp', dial:'assets/img/dial-ivory.webp' },
    anim:{ pv:[558,633], mc:[821,438], mr:342, bp:[550,723], br:143, r:331 } }
];
HAL.availability = 'Available (demo)';
HAL.shipping = [
  { id:'std', label:'Standard shipping', cost:25, note:'Sample rate. Replace with your real rate.' },
  { id:'exp', label:'Express shipping',  cost:60, note:'Sample rate. Replace with your real rate.' },
  { id:'ins', label:'Insured courier',   cost:90, note:'Sample rate. Replace with your real rate.' }
];
HAL.countries = ['Nigeria','Ghana','Kenya','South Africa','Egypt','United Kingdom','United States','Canada','Germany','France','Netherlands','United Arab Emirates','India','Australia'];

/* Optional extras per product. Fill these in when the new assets arrive. */
HAL.inspectLabels = [
    { from:0, to:.12, title:'Sunburst dial', text:'Slim baton indices and slim hands on a sunburst-finished dial.' },
    { from:.12, to:.30, title:'Case profile', text:'A slim polished case, with the crown at 3 o\'clock.' },
    { from:.30, to:.38, title:'Caseback removed', text:'The caseback is lifted away to expose the movement.' },
    { from:.38, to:.47, title:'Mechanical movement', text:'The watch\'s engine: gear wheels, bridges and screws, with jewel bearings.' },
    { from:.47, to:.72, title:'Exploded view', text:'Components separated to show how the movement is built.' },
    { from:.72, to:.90, title:'Reassembly', text:'The components return and the caseback is fitted back on.' },
    { from:.90, to:1, title:'Finished watch', text:'Assembled, and shown dial-side again.' }
  ];
/* Labels for each watch, written from what its own inspect frames show. from/to are positions 0 to 1 along the 72 frames. Ranges follow each other with no gaps. */
HAL.inspectLabelsBy = {
  azure:[
    { from:0, to:.12, title:'Sunburst dial', text:'Deep blue sunburst finish, with slim gold baton indices and slim hands.' },
    { from:.12, to:.21, title:'Case profile', text:'A slim polished gold case, with the crown at 3 o\'clock.' },
    { from:.21, to:.30, title:'Caseback', text:'A solid caseback in matching gold, secured with screws.' },
    { from:.30, to:.38, title:'Caseback removed', text:'The caseback is lifted away to expose the movement.' },
    { from:.38, to:.47, title:'Mechanical movement', text:'The watch\'s engine: gear wheels, bridges and screws, with jewel bearings.' },
    { from:.47, to:.72, title:'Exploded view', text:'Wheels, springs, screws and bridges separated to show how the movement is built.' },
    { from:.72, to:.80, title:'Reassembly', text:'The components return to their positions.' },
    { from:.80, to:.90, title:'Caseback refitted', text:'The caseback is fitted back onto the case.' },
    { from:.90, to:1, title:'Finished watch', text:'Assembled, and shown dial-side again.' }
  ],
  cocoa:[
    { from:0, to:.12, title:'Sunburst dial', text:'Brown sunburst finish, with slim rose gold baton indices and slim hands.' },
    { from:.12, to:.21, title:'Case profile', text:'A polished rose gold case, shown three-quarter on, with the crown at 3 o\'clock.' },
    { from:.21, to:.30, title:'Caseback', text:'A solid caseback, secured with screws.' },
    { from:.30, to:.38, title:'Caseback removed', text:'The caseback is lifted away to expose the movement.' },
    { from:.38, to:.47, title:'Mechanical movement', text:'The watch\'s engine: gear wheels and bridges, with jewel bearings.' },
    { from:.47, to:.72, title:'Exploded view', text:'Wheels, screws and small parts separated to show how the movement is built.' },
    { from:.72, to:.80, title:'Reassembly', text:'The components return and the caseback is brought back.' },
    { from:.80, to:.90, title:'Caseback refitted', text:'The caseback is fitted back on, with its screws.' },
    { from:.90, to:1, title:'Finished watch', text:'Assembled, and shown from the side to display the slim case.' }
  ],
  onyx:[
    { from:0, to:.12, title:'Sunburst dial', text:'Black sunburst finish, with slim silver baton indices and slim hands.' },
    { from:.12, to:.21, title:'Case finish', text:'A polished stainless steel case.' },
    { from:.21, to:.30, title:'Case profile', text:'A slim steel case, with the crown at 3 o\'clock.' },
    { from:.30, to:.38, title:'Caseback', text:'A plain steel caseback.' },
    { from:.38, to:.47, title:'Caseback removed', text:'The caseback swings away to expose the movement.' },
    { from:.47, to:.55, title:'Mechanical movement', text:'The watch\'s engine: gear wheels, jewel bearings and blued screws.' },
    { from:.55, to:.80, title:'Exploded view', text:'Bridges, wheels and screws lifted away to show how the movement is built.' },
    { from:.80, to:.90, title:'Caseback refitted', text:'The steel caseback is fitted back on.' },
    { from:.90, to:1, title:'Finished watch', text:'Assembled, and shown dial-side again.' }
  ],
  verde:[
    { from:0, to:.13, title:'Case profile', text:'A slim gold case seen from the side, with the crown at 3 o\'clock.' },
    { from:.13, to:.21, title:'Caseback', text:'A smooth gold caseback, on a green leather strap.' },
    { from:.21, to:.30, title:'Mechanical movement', text:'The watch\'s engine: gear wheels and bridges, with jewel bearings.' },
    { from:.30, to:.38, title:'Disassembly', text:'Small parts begin to lift away from the movement.' },
    { from:.38, to:.64, title:'Exploded view', text:'Wheels, bridges and screws separated to show how the movement is built.' },
    { from:.64, to:.72, title:'Reassembly', text:'The components settle and the caseback is brought back.' },
    { from:.72, to:.80, title:'Caseback refitted', text:'The gold caseback is fitted back on.' },
    { from:.80, to:.88, title:'Case profile', text:'The finished case, seen from the side.' },
    { from:.88, to:1, title:'Finished watch', text:'Champagne sunburst dial, with slim gold baton indices and hands.' }
  ],
  ivory:[
    { from:0, to:.12, title:'Sunburst dial', text:'Ivory sunburst finish, with slim steel baton indices and slim hands.' },
    { from:.12, to:.21, title:'Case profile', text:'A slim polished steel case, with the crown at 3 o\'clock.' },
    { from:.21, to:.27, title:'Caseback', text:'A plain steel caseback.' },
    { from:.27, to:.32, title:'Caseback removed', text:'The caseback is lifted away to expose the movement.' },
    { from:.32, to:.37, title:'Mechanical movement', text:'The watch\'s engine: gear wheels, jewel bearings and blued screws.' },
    { from:.37, to:.56, title:'Exploded view', text:'Wheels, screws and small parts separated to show how the movement is built.' },
    { from:.56, to:.61, title:'Reassembly', text:'The components return and the caseback swings back.' },
    { from:.61, to:.76, title:'Caseback refitted', text:'The steel caseback is fitted back on.' },
    { from:.76, to:1, title:'Finished watch', text:'Assembled, and shown dial-side again.' }
  ]
};
HAL.products.forEach(function(p){
  p.gallery = [{ src:'assets/img/gallery/'+p.id+'-side.webp', label:'Side view' }, { src:'assets/img/gallery/'+p.id+'-back.webp', label:'Case back' }];
  p.inspect = p.inspect || { dir:'assets/inspect/' + p.id, count:72, labels:HAL.inspectLabelsBy[p.id] || HAL.inspectLabels };  /* count = number of frames in the folder; 0 falls back to the dial zoom */
});
