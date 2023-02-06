using Photon.Pun;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

public class ReactManager : MonoBehaviour
{

    public string nickname;
   
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    public void getNickname()
    {
        Debug.Log(nickname + "리턴");
        //return nickname;
    }
    public void getUserId(string user_id)
    {
        this.nickname= user_id;
        //Debug.Log($"유저 {user_id} 아이디 가져옴");
        Debug.Log("유저 아이디 가져옴:"+user_id);
        Debug.Log("이제 닉넴은 " + nickname);

    }
    
    public void setNickname(string name)
    {
        Debug.Log("setNickname 호출됨");
        //모든 플레이어 중에서
        GameObject[] players = GameObject.FindGameObjectsWithTag("Player");
        for (int i = 0; i < players.Length; i++)
        {    //이동한 애(=자기 자신)을 리액트에서 보내준 이름으로 설정
              if (players[i].GetComponent<PhotonView>().IsMine)
              {
            Transform t = players[i].GetComponent<Transform>();
            t.Find("name").GetComponent<TextMesh>().text = name+"님";

              }
        }
    }
    
 

}
