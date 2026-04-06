import { ScrollView, StyleSheet, Text, View, Animated, ActivityIndicator, Easing } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { globalStyle } from "../Constants/globalStyles";
import { Colors } from "../Constants/styleVariable";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/slices/authSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getNotifications } from "../Service/notificationService";

const NotificationTab = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (isLoading) {
      fadeAnim.setValue(0);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, fadeAnim]);

  const getIconName = (type) => {
    switch (type) {
      case 'streak_reminder':
        return 'local-fire-department';
      case 'journal_reminder':
        return 'edit';
      case 'checkin_reminder':
        return 'schedule';
      default:
        return 'notifications';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <View style={[{ flex: 1, justifyContent:'center', alignItems:'center', backgroundColor: '#FBE7E5' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: "#FBE7E5", opacity: fadeAnim }, globalStyle.container]}>
      <View style={{ marginTop: 20, flex: 1 }}>
        <Text style={{ fontSize: 24, fontFamily: "Fredoka-Medium", color: Colors.primary, marginBottom: 20 }}>
          Notifications
        </Text>
        <ScrollView style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <View key={notification._id} style={styles.notiCards}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={styles.iconContainer}>
                      <MaterialIcons name={getIconName(notification.type)} size={28} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.titleText}>
                        {notification.title}
                      </Text>
                      <Text style={styles.bodyText}>{notification.body}</Text>
                      <Text style={styles.dateText}>
                        {formatDate(notification.sentAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
                <View style={{flexDirection:'row', alignContent:'center', alignItems:'center', gap:8}}>
                    <MaterialIcons name="notifications-off" size={28} color={Colors.primary} />
                
                  <View style={{ flex: 1 }}>
                    <Text style={styles.titleText}>
                      No Notifications
                    </Text>
                    <Text style={styles.bodyText}>You don't have any notifications yet.</Text>
                    </View>
                </View>               
            )}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default NotificationTab;

const styles = StyleSheet.create({
    notiCards:{
        backgroundColor:"white",
        width:'100%',
        padding:16,
        borderRadius:16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 8,
    },
    iconContainer: {
        backgroundColor: '#FBE7E5',
        padding: 12,
        borderRadius: 50,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontFamily: 'Fredoka-Semibold',
        fontSize: 16,
        color: Colors.primary,
        marginBottom: 4,
    },
    bodyText: {
        fontFamily: 'Fredoka-Regular',
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    dateText: {
        fontFamily: 'Fredoka-Regular',
        fontSize: 12,
        color: '#999',
    }
})