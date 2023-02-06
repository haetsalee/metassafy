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
        Debug.Log(nickname + "����");
        //return nickname;
    }
    public void getUserId(string user_id)
    {
        this.nickname= user_id;
        //Debug.Log($"���� {user_id} ���̵� ������");
        Debug.Log("���� ���̵� ������:"+user_id);
        Debug.Log("���� �г��� " + nickname);

    }
    
    public void setNickname(string name)
    {
        Debug.Log("setNickname ȣ���");
        //��� �÷��̾� �߿���
        GameObject[] players = GameObject.FindGameObjectsWithTag("Player");
        for (int i = 0; i < players.Length; i++)
        {    //�̵��� ��(=�ڱ� �ڽ�)�� ����Ʈ���� ������ �̸����� ����
              if (players[i].GetComponent<PhotonView>().IsMine)
              {
            Transform t = players[i].GetComponent<Transform>();
            t.Find("name").GetComponent<TextMesh>().text = name+"��";

              }
        }
    }
    
 

}