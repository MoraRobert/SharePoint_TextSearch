//a szükséges importok
import * as React from 'react';
import { ITextSearchProps } from './ITextSearchProps';

//a máshol is alkalmazott metódus
export const parseString = (str)=>{
  parseString(str);
};

//a helyi state kiexportálva
export interface ITextSearchState{      
  searchText: string
} 

//a tartalmazó osztály
export default class ManipulateTextIn extends React.Component < ITextSearchProps, ITextSearchState >{

  public constructor(props: ITextSearchProps, state: ITextSearchState){   
    super(props);    
    this.state = {          //üres keresővel indulunk
      searchText: ''
    };
  }
  
  //a .tsx -ből meghívjuk a metódust
  public parseString(textIn): string {   

    var filter = '';      //ezt a stringet fogjuk visszaadni, ha marad üres, nem szűrűnk
    var filter1 = '', filter2 = '', splittedA, splittedO, splittedN, splittedE;/**segédváltozók */
    
    console.log("PARSESTRING CALLED");

    if(textIn.search(" ") != -1 ){          //ha van szóköz, akkor az ÉS operátor
      splittedA = textIn.split(" ");
      for(var i = 0; i < splittedA.length; i++){
        filter1 = '';
        if(splittedA[i].length > 3){
          if(filter != '' ) {filter += ' and '}
          if(splittedA[i].search("\\|") != -1 ){   //ha van | a részhalmazban, akkor az VAGY operátor
            splittedO = splittedA[i].split("|");
            for(var j = 0; j < splittedO.length; j++){
              //filter2 = "";
              if(splittedO[j].length > 3){
                if(filter1 != '') {filter1 += ' or '}
                if (splittedO[j].search("-") != -1){ //ha a részhalmaz részhalmazában van - akkor az NEM operátor
                  splittedN = splittedO[j].split("-");
                  for(var k = 0; k < splittedN.length; k++){
                    if(splittedN[k].length > 3){
                      if(filter2 != '' ) {filter2 += ' and not '}
                      else if (k != 0) {filter2 += 'not'}
                      filter2 += this.composeFilterForSubstring(splittedN[k]);
                    }
                  } filter1 += filter2;
                } else {filter1 += this.composeFilterForSubstring(splittedO[j]);}
              } 
            } filter += filter1;
          } else if(splittedA[i].search("-") != -1 ){     //ha van - a részhalmazban, akkor kizárjuk az adatot
            splittedN = splittedA[i].split("-");
            for(var j = 0; j < splittedN.length; j++){
              if(splittedN[j].length > 3){
                if(filter1 != '' ) {filter1 += ' and not '}
                else if (j != 0) {filter1 += 'not'}
                filter1 += this.composeFilterForSubstring(splittedN[j]);
              }
            } filter += filter1;
          } else if(splittedA[i].search('"') != -1 ){     //ha van "" a részhalmazban, akkor pontos szövegre keresünk
            splittedE = splittedA[i].split('"');
            for(var j = 1; j < splittedE.length - 1; j=i+2){    //az elsőt és az utolsót nem vesszük figyelembe, 
                                                                //mert azok üresek, kettessével inkrementálunk, mert páros operátor
              if(splittedE[j].length > 3){
                if(filter1 != '' ) {filter1 += ' and '}
                filter1 += this.compseFilterForEquals(splittedE[j]);
              }
              } filter += filter1;
            } else { filter += this.composeFilterForSubstring(splittedA[i])}
        }
      }
    } else if(textIn.search("\\|") != -1 ){   //ha van |, akkor az VAGY operátor
        splittedO = textIn.split("|");
        for(var i = 0; i < splittedO.length; i++){
          if(splittedO[i].length > 3){            
            if(filter != '') {filter += ' or '}
            if(splittedO[i].search("-") != -1 ){     //ha van - a részhalmazban, akkor kizárjuk az adatot
              splittedN = splittedO[i].split("-");
              for(var j = 0; j < splittedN.length; j++){
                if(splittedN[j].length > 3){
                  if(filter1 != '' ) {filter1 += ' and not '}
                  else if (j != 0) {filter1 += 'not'}
                  filter1 += this.composeFilterForSubstring(splittedN[j]);
                }
              } filter += filter1;
            } else if(splittedO[i].search('"') != -1 ){     //ha van "" a részhalmazban, akkor pontos szövegre keresünk
              splittedE = splittedO[i].split('"');
              for(var j = 1; j < splittedE.length - 1; j=i+2){    //az elsőt és az utolsót nem vesszük figyelembe, 
                                                                  //mert azok üresek, kettessével inkrementálunk, mert páros operátor
                if(splittedE[j].length > 3){
                  if(filter1 != '' ) {filter1 += ' and '}
                  filter1 += this.compseFilterForEquals(splittedE[j]);
                }
                } filter += filter1;
              } else { filter += this.composeFilterForSubstring(splittedO[i]);}            
          } 
        }           
    } else if(textIn.search('-') != -1 ){     //ha van -, akkor kizárjuk az adatot
      splittedN = textIn.split('-');
      for(var i = 0; i < splittedN.length; i++){    
        if(splittedN[i].length > 3){          
          if(filter != '' ) {filter += ' and not '}          
          else if (textIn.search('-') == 0) {filter += 'not'}
          if(splittedN[i].search('"') != -1 ){     //ha van "" a részhalmazban, akkor pontos szövegre keresünk
              splittedE = splittedN[i].split('"');
              for(var j = 1; j < splittedE.length - 1; j=i+2){    //az elsőt és az utolsót nem vesszük figyelembe, 
                                                                  //mert azok üresek, kettessével inkrementálunk, mert páros operátor
                if(splittedE[j].length > 3){
                  if(filter1 != '' ) {filter1 += ' and '}
                  filter1 += this.compseFilterForEquals(splittedE[j]);
                }
                } filter += filter1;
              } else { filter += this.composeFilterForSubstring(splittedN[i]);}
        }
      }
    } else if(textIn.search('"') != -1 ){     //ha van "", akkor pontos szövegre keresünk
     splittedE = textIn.split('"');
     for(var i = 1; i < splittedE.length - 1; i=i+2){    //az elsőt és az utolsót nem vesszük figyelembe, 
                                                         //mert azok üresek, kettessével inkrementálunk, mert páros operátor
       if(splittedE[i].length > 3){
         if(filter != '' ) {filter += ' and '}
         filter += this.compseFilterForEquals(splittedE[i]);
       }
     }
    } else if(textIn.length > 3){                                  // ha nem tartalmaz operátort a beírt szöveg      
      filter = this.composeFilterForSubstring(textIn);      
    }

    console.log(filter);
    return filter;
  }

  //ismétlődő kódsor kiszervezése
  private composeFilterForSubstring(str): string {
    var fltr = '( ' +  str + ' substringof Projekt_x0020_n_x00e9_v_x0020__x or  ' +
                       str + ' substringof St_x00e1_tusz or  ' +
                       str + ' substringof Megrendel_x0151__x0020_n_x00e9_v or  ' +
                       str + ' substringof Partner_x0020_n_x00e9_v_x0020__x or  ' +
                       str + ' substringof Szerz_x0151_d_x00e9_s_x0020_t_x00 )'
    return fltr;                      
  }

  private compseFilterForEquals(str): string {
    var fltr = '( ' +  str + ' eq Projekt_x0020_n_x00e9_v_x0020__x or  ' +
                       str + ' eq St_x00e1_tusz or  ' +
                       str + ' eq Megrendel_x0151__x0020_n_x00e9_v or  ' +
                       str + ' eq Partner_x0020_n_x00e9_v_x0020__x or  ' +
                       str + ' eq Szerz_x0151_d_x00e9_s_x0020_t_x00 )'
    return fltr;                       
  }
}