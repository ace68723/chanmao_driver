package com.cm_driver_newversion;

import java.io.Serializable;

/**
 * Created by Administrator on 2017/2/23.
 */

public class Details implements Serializable {
    Data data;
    String authrole;
    String[] authroles;
    String authid;
    Object roles;
    public Data getData(){return data;}
    public void setData(Data data){this.data=data;}
    public String getAuthrole(){return authrole;}
    public void setAuthrole(String authrole){this.authrole=authrole;}
    public String[] getAuthroles(){return authroles;}
    public void setAuthroles(String[] authroles){this.authroles=authroles;}
    public String getAuthid(){return authid;}
    public void setAuthid(String authid){this.authid=authid;}
    public Object getRoles(){return roles;}
    public void setRoles(Object roles){this.roles=roles;}
}
