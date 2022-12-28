import styles from '../styles/Home.module.css'
import arrowUp from './assets/arrow_up.png'
import arrowLeft from './assets/arrow_left.png'
import arrowRight from './assets/arrow_right.png'
import arrowDown from './assets/arrow_down.png'
import legionnaire from './assets/legionnaire.png'
import castle from './assets/castle.gif'
import { FC } from 'react';

function open_send_menu(my_id: any, aim_id: any, aim_login: any, distance: any) {
  var result = 'Send  <input type="text" id="wars"> warriors to player : ' + aim_login;
  result += ' <input type="button" value="GO" onclick="send_war(' + my_id + ',' + aim_id + ',' + distance + ')">';
  $('#send').html(result);
}

function coords(x: any, y: any, login: any, distance: any) {
  // console.log(login);

  if(distance != null)
  {
    $('#info').html('x: ' + x + '<br>y: ' + y + '<br>id: ' + login + '<br>distance: '+ distance);
  }
  else if(login != null)
  {
    $('#info').html('x: ' + x + '<br>y: ' + y + '<br>id: ' + login + '<br>distance: -');
  }
  else
  {
    $('#info').html('x: ' + x + '<br>y: ' + y + '<br>id: -<br>distance: -');
  }
}

function map(id: any, center_x: any, center_y: any) {
  ($ as any).post
  ( 'php/ajax.php',
    {act : 'map', id:id ,center_x:center_x, center_y:center_y},
    function(data: any)
    {
      // data[0][№cell][x,y][id][login]
      // data[1][me_x,me_y,me_id,me_login]
      // data[2][center_x,center_y]
      // data[3][warriors]

      // console.log(data[0][1][3]);

      // $x = 'hello' + data[0][1][3];
      // console.log($x);
      // console.log(data[0]);
      /////////////отображаем пришедшую карту
      var me_x = data[1][0];
      var me_y = data[1][1];
      var table = '';
      var count = 0; // считает №cell
      for(var j=data[0][0][1];j<=data[0][80][1]; j++)
      {
        table += '<tr>';
        for(var i = data[0][0][0];i<=data[0][80][0];i++)
        {
          if(i == me_x && j == me_y)
          {
            table += '<td class="map_element" id="castle'+i+j+'"';
            table += ' onmouseover="coords('+i+','+j+','+data[1][2]+',null)">';
            table += ' <img src="media/images/me.gif"/></td>';
            count++;
          }
          else if(data[0][count].length == 4)
          {
            table += '<td class="map_element" id="castle'+i+j+'"';
            table += ' onmouseover="coords('+i+','+j+','+data[0][count][2]+','+pathfind(me_x,me_y,data[0][count][0],data[0][count][1])+')"';
            table += ' onclick="open_send_menu(' + data[1][2] + ',' + data[0][count][2] + ',' + data[0][count][2] + ',' + pathfind(me_x,me_y,data[0][count][0],data[0][count][1]) + ')">';
            // table += ' onclick="open_send_menu(' + data[1][2] + ',' + data[0][count][2] + ',' + data[0][count][3] + ',' + pathfind(me_x,me_y,data[0][count][0],data[0][count][1]) + ')">';
            table += ' <img src="media/images/castle.gif"/></td>';
            count++;
          }
          else
          {
            table += '<td class="map_element"';
            table += ' onmouseover="coords('+i+','+j+',null,null)">';
            table += ' <img src="media/images/place.gif"/></td>';
            count++;
          }
        }
        table += '</tr>';
      }

      $('#map').html(table);
      /////////////// боковые панели с координатами
      var xcords = '';
      var ycords = '';
      for(var i=0; i<9; i++)
      {
        xcords += '<div style="text-align:center;padding-left:'+32*i+'px;width:30px;height:30px;position:absolute;">'+(data[0][0][0]+i)+'</div>';
        ycords += '<div style="text-align:center;padding-top:'+32*i+'px;width:30px;height:30px;position:absolute;">'+(data[0][0][1]+i)+'</div>';
      }
      $('#x').html(xcords);
      $('#y').html(ycords);
      ////////////// задаем кнопки перемещения по карте
      var id = data[1][2]*1;
      var x = data[2][0]*1;
      var y = data[2][1]*1;
      $('#left').unbind();
      $('#left').one('click', function(){map(id,(x-1),y);});
      $('#up').unbind();
      $('#up').one('click', function(){map(id,x,(y-1));});
      $('#down').unbind();
      $('#down').one('click', function(){map(id,x,(y+1));});
      $('#right').unbind();
      $('#right').one('click', function(){map(id,(x+1),y);});
    },
    'JSON'
  )
}

// const TableCell: FC = () => {
//   for (var i = data[0][0][0]; i <= data[0][80][0]; i++) {
//
//   }
// }
//
// const TableRows: FC = () => {
//   const content = []
//
//   for (var j = data[0][0][1]; j <= data[0][80][1]; j++) {
//     table += '<tr>';
//     TableCell
//   }
//
//   return <>
//   </>
// }


export default function Home() {
  return (
    <div>
      <input type="button" id="exitt" value="exit"/>
      <br />
      <div style={{ height: '320px', width: '1000px' }}>
        <div className={styles.container} id="container">
          <div id="x"></div>
          <div id="y"></div>
          <table className={styles.map} id="map" cellSpacing="0" cellPadding="0">
            <td className="map_element"
                id="castle'+i+j+'"
                // onmouseover="coords('+i+','+j+','+data[0][count][2]+','+pathfind(me_x,me_y,data[0][count][0],data[0][count][1])+')"
                // onclick="open_send_menu(' + data[1][2] + ',' + data[0][count][2] + ',' + data[0][count][2] + ',' + pathfind(me_x,me_y,data[0][count][0],data[0][count][1]) + ')"
            >
              <img src={castle.src}/>
            </td>
          </table>
        </div>
        <div className={styles.info} id="info" />
        <div className={styles.arrows} id="arrows">
          <div style={{ marginLeft: 64, position: 'absolute' }}>
            <img id="up" src={arrowUp.src}/>
          </div>
          <div style={{ marginTop:64, position: 'absolute' }}>
            <img id="left" src={arrowLeft.src}/>
          </div>
          <div style={{ marginLeft:128, marginTop: '64px', position: 'absolute' }}>
            <img id="right" src={arrowRight.src}/>
          </div>
          <div style={{ marginLeft: 64, marginTop: 128, position: 'absolute' }}>
            <img id="down" src={arrowDown.src}/>
          </div>
        </div>

        <div className={styles.warriors} id="warriors">
          <div className={styles.img} id="img">
            <img src={legionnaire.src} />
          <div className={styles.number} id="number" />
        </div>

        <div className={styles.war_situation} id="war_situation">
        </div>
      </div>
      <div id="send" style={{ width: '400px', height: '30px' }} />
    </div>
    </div>
  )
}
