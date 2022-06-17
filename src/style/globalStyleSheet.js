import React from "react";
import { StyleSheet } from "react-native";


export const GlobalStyles = StyleSheet.create({
    container: {
        marginTop: 50,   
        alignItems:'center'     
    },
 
    Logo: {
        alignItems: 'center',
        width: 144,
        height: 144,
    },
    LogoName: {
        marginTop: 25,
        marginBottom: 80,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 26
    },
    Small_Logo: {
      alignSelf: 'center',
      alignContent: 'center',
      alignItems: 'center',
      width: 72,
      height: 72,
  },
  Small_LogoName: {
      marginTop: 10,
      marginBottom: 10,
      alignSelf: 'center',
      width: 72,
      height: 12.48
  },
    Hamburger: {
        marginTop: 10,
        padding: 10,
    },
    HamburgerImage: {
        marginTop: 5,
        width: 30
    },
    Text: {
        color: '#16E1FF',
        fontSize: 20,
        textAlign: 'center',
        letterSpacing: 2
    },
    Font: {
      fontSize: 12,
      fontFamily: 'Jost-Light',
      letterSpacing: 2,
    },
    Check_box_text:{
        fontSize: 14,
        fontFamily: 'Jost-Light',
    },
    color: {
        color: '#16E1FF',
      },
      color_Two: {
        color: '#2a2c2d',
      },
      Link: {
        textDecorationLine: 'underline',
      },
    
      Flex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
      },
      View_Flex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center'
    
      },
      
      UserImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: '#16E1FF',
    },
    List: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 20,
        marginTop: 20
    },
    NameButton: {
      backgroundColor: '#16E1FF',
      borderColor:'#16e1ff',
      borderWidth:1,
      alignContent:'center',
      padding: 10,
      marginLeft: 10,
      flex: 1,
      // letterSpacing: 2,
      borderRadius: 5,
  },
      Terms: {
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 2
      },
      Cross : {
        padding:5,
        color:'#16E1FF',
        fontSize:20,
        width:'12%',
        textAlign:'center',
        marginTop:20,
        marginLeft:10
    } ,
      Close: {
        color: '#16E1FF',
        fontSize: 20,
        borderWidth: 1,
        borderColor: '#16E1FF',
        borderRadius: 5,
      },
      checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
      },
      checkbox: {
        alignSelf: "center",
      },
    Input: {
        backgroundColor: '#2a2c2d',
        color: '#16E1FF',
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#16E1FF',
        marginTop: 12,
        width: '80%',
        fontFamily: 'Jost-Light',
        letterSpacing: 2,
        borderRadius: 5
  
    },
    InputDisabled: {
      backgroundColor: 'transparent',
      marginTop: 20,
      paddingVertical: 10,
      borderColor: '#16E1FF',
      width: '30%',
      fontFamily: 'Jost-Light',
      borderWidth: 1,
      borderRadius: 5,
      
    },
    InputTextDisabled: {
      color: '#16E1FF',
      textAlign: 'center',
      fontSize: 16,
      opacity: 0.4,
  
    },
    Transfer: {
      backgroundColor: 'transparent',
      marginTop: 20,
      color: '#16E1FF',
      textAlign: 'center',
      fontSize: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: '#16E1FF',
      letterSpacing: 2,
      width: '80%',
      alignSelf: 'center'
    },
    InputText: {
      color: '#16E1FF',
      textAlign: 'center',
      fontSize: 16,
      textAlignVertical:'center',
    },
    Button: {
        backgroundColor: '#16E1FF',
        borderColor: '#16e1ff',
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
        width: '80%',
        borderRadius: 5,
    },
    ButtonText: {
        color: '#2a2c2d',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Jost',
        letterSpacing: 2
    },
    ButtonPressed: {
        color: '#16e1ff',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Jost',
        letterSpacing: 2
    },
    Transparent_Button: {
        backgroundColor: '#2a2c2d',
        borderColor: '#16E1FF',
        alignSelf: 'center',
        borderWidth: 1,
        width: '80%',
        padding: 10,
        borderRadius: 5,
      },
      Transparent_ButtonText: {
        color: '#16e1ff',
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 2,
      },
      Transparent_ButtonPressed: {
        color:'#2a2c2d',
        textAlign: 'center',
        borderColor:'#16e1ff',
        fontSize: 20,
        fontFamily: 'Jost',
        letterSpacing: 2,
        borderWidth: 1,
        borderColor: '#16e1ff',
      },
    Modal_Body: {
        backgroundColor: '#16E1FF',
        color: '#2A2C2D',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '56%',
        height: 152,
      },
      Edit_Modal_Body: {
        backgroundColor: '#16E1FF',
        color: '#2A2C2D',
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        padding: 20,
        marginTop: '40%',
      },
      Modal_Inner: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      Modal_Inner_Column: {
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      },
      Edit_Modal_Inner:{
        width:'80%',
        display:'flex',
        justifyContent:'space-between'
      },
      Modal_Text: {
        color: '#2A2C2D',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Jost-Light',
        fontSize: 20,
      },
      Modal_Cross: {
        height: 35,
        width: 35,
        borderColor: '#2A2C2D',
        color: '#2A2C2D',
        borderWidth: 1,
        fontSize: 25,
        borderRadius: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 15
      },
      Modal_Button_Inner: {
        color: '#2a2c2d',
        backgroundColor:'',
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 2,
        borderWidth:1,
        padding:10,
        borderColor:'#2a2c2d',
        marginTop:20,
        borderRadius:5
      },
      Modal_Underline: {
        textDecorationLine: 'underline',
        color: '#2A2C2D',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Jost-Light',
        fontSize: 20
      },
      Box: {
        width: 50,
        height: 50,
        borderColor: '#16E1FF',
        borderWidth: 1,
        // textAlign: 'center',
        borderRadius: 50,
        // textAlignVertical: 'center',
        // fontFamily: 'Jost-Medium',
        // fontSize: 20,
        // letterSpacing: 2
    },
    root: {
      backgroundColor: '#2a2c2d',
      flex: 1,
      // padding: 20,
      alignItems:'center',
      position: 'relative'
    },
    inputField: {
      marginBottom: 10,
      flexDirection: 'column',
    },
    videoContainer: {
      flex: 1,
      minHeight: 450,
    },
    videos: {
      width: '100%',
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
  
      borderRadius: 6,
    },
    localVideos: {
      height: 100,
      marginBottom: 10,
    },
    remoteVideos: {
      height: 400,
    },
    localVideo: {
      height: '100%',
      width: '100%',
    },
    remoteVideo: {
      backgroundColor: '#2a2c2d',
      height: '100%',
      width: '100%',
      position: "absolute",
    },
    row: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBottom: 30,
  },

  redButton: {
      backgroundColor: '#FF1637',
  },
  paddingButton: {
      width: '80%',
  },
  Background: {
    height: 700,
  },
  Transparent_Input : {
    backgroundColor:'#2A2C2D',
    color:'#16E1FF',
    width:'80%',
    textAlign:'center',
    borderRadius:5,
    fontSize:16,
    padding:10,
    fontFamily:'Jost-Light',
    marginBottom:10,
    marginTop:10

  },
  Transparent_Input_View: {
    backgroundColor: 'transparent',
    marginTop: 20,
    paddingVertical: 10,
    borderColor: '#16E1FF',
    fontFamily: 'Jost-Light',
    borderWidth: 1,
    width: '30%',
    borderRadius: 5,
    height: 55,
  }, 
  Padding: {
    padding: 20
  },
  InviteButton: {
    marginTop: 0,
    letterSpacing: 2,
    borderRadius: 5
  },
  Invite : {
    backgroundColor:'#16E1FF',
    alignItems:'center',
    padding:10,
    borderColor:'#2A2C2D',
    borderWidth:1
  },
  ButtonEnter: {
    backgroundColor: '#16E1FF',
    padding: 10,
    marginTop: 20,
    width: '80%',
    borderRadius: 5,
    //marginTop: 0,
    //position: 'absolute',
    //bottom: '20%',
    width: '80%',
    alignSelf:'center',
    borderColor:'#2a2c2d',
    borderWidth:1
  },
  Invite_Text: {
    fontSize:20,
    fontFamily:'Jost-Light',
    color: '#2A2C2D',
    letterSpacing: 2,

  },
  PressableButton: {
    borderColor: '#2A2C2D',
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    marginHorizontal: '20%',
    width: '60%',
    textAlign: 'center',
    borderRadius: 5
  },
  TextArea: {
    color: '#2A2C2D',
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#2A2C2D',
    marginTop: 12,
    width: '100%',
    fontFamily: 'Jost-Light',
    letterSpacing: 2,
    borderRadius: 5,
    height: 100,
  },
  MainMenuModel: {
    backgroundColor: '#2A2C2D',
  },
  MainMenuPopup: {
    backgroundColor: '#2a2c2dcc',
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 30,
    width: '100%',
    height: '100%'

  }
  });