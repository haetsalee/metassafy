using Photon.Pun;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UIElements;
using Photon.Pun;

public class respawn : MonoBehaviourPun
{
    Boolean dead = false;
    // Start is called before the first frame update
    void Start()
    {
        
    }
    public GameObject map;
    // Update is called once per frame
    Vector3 target = new Vector3(0, 0, 0);

    void Update()
    {

    }

    private void OnTriggerEnter(Collider other)

    {
        if (other.gameObject.tag == "Player")
        {
            Debug.Log(other.name + "�������� �����!");
            dead = true;
            Debug.Log(dead);
            
        }
        if (dead == true)
        {
            Debug.Log("�̵�!!");
            //transform.position = Vector3.MoveTowards(transform.position, target, 0.1f);
            sceneReroad();
            dead = false;
        }


    }

    void sceneReroad()
    {
        Debug.Log("�κ� Ŭ��");

        //��� �÷��̾� �߿���
        GameObject[] players = GameObject.FindGameObjectsWithTag("Player");
        for (int i = 0; i < players.Length; i++)
        {    //�̵��� ��(=�ڱ� �ڽ�)�� ��Ʈ��ũ���� ���� 
            if (players[i].GetComponent<PhotonView>().IsMine)
            {
                PhotonNetwork.Disconnect();
            }
        }
        //�� �̵�
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }







}