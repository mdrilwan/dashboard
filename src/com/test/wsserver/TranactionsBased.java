package com.test.wsserver;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

@ServerEndpoint("/tansactionsStream")
public class TranactionsBased {

	private static final Set<Session> sessionList = Collections.synchronizedSet(new HashSet<Session>());
	private Session session;
	private ScheduledExecutorService timer;
	private ScheduledFuture<?> scheduler;
	private JSONObject msg = new JSONObject();
	private String chart = "";
	private JSONArray msgToSend = new JSONArray();;

	@OnOpen
	public void onOpen(Session session) {
		this.sessionList.add(session);
		this.session = session;
		System.out.println("opened");
		this.timer = Executors.newSingleThreadScheduledExecutor();
		this.scheduler = timer.scheduleAtFixedRate(sendMessage, 0, 1, TimeUnit.SECONDS);
	}

	@OnClose
	public void onClose(Session session) throws IOException {
		sessionList.remove(session);
		System.out.println("closed");
	}

	@OnMessage
	public void onMessage(String msg) throws InterruptedException {
		System.out.println("Received " + msg);
		this.chart = msg;
	}

	private Runnable sendMessage = new Runnable() {

		public void run() {
			try {
				if (chart.equals("bar")) {
					msg = new JSONObject();
					msg.put("value", String.valueOf((Math.round(Math.random() * 100) / 1)));

					session.getBasicRemote().sendText(msg.toString());
				} else if (chart.equals("total")) {
					session.getBasicRemote().sendText(String.valueOf(Math.round((Math.random() * 100))));
				} else if (chart.equals("gauge")) {
					msg = new JSONObject();
					msg.put("value", String.valueOf((Math.round(Math.random() * 10) / 1)));

					session.getBasicRemote().sendText(msg.toString());
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	};
}