package com.sourdough.location

import android.content.Context
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SourdoughLocationModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context lost")

  override fun definition() = ModuleDefinition {
    Name("SourdoughLocation")

    AsyncFunction("getCurrentPositionAsync") { promise: Promise ->
      getCurrentPosition(promise)
    }
  }

  private fun getCurrentPosition(promise: Promise) {
    val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

    val lastKnown = listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)
      .mapNotNull { provider ->
        runCatching { locationManager.getLastKnownLocation(provider) }.getOrNull()
      }
      .maxByOrNull { it.time }

    val isFresh = lastKnown != null && System.currentTimeMillis() - lastKnown.time < 30_000
    if (isFresh) {
      promise.resolve(locationToMap(lastKnown))
      return
    }

    val providers = listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)
      .filter { provider ->
        runCatching { locationManager.isProviderEnabled(provider) }.getOrDefault(false)
      }

    if (providers.isEmpty()) {
      if (lastKnown != null) {
        promise.resolve(locationToMap(lastKnown))
      } else {
        promise.reject("ERR_LOCATION_UNAVAILABLE", "Unable to determine location. No location providers are enabled.", null)
      }
      return
    }

    var settled = false
    val handler = Handler(Looper.getMainLooper())
    lateinit var timeout: Runnable
    val listener = object : LocationListener {
      override fun onLocationChanged(location: Location) {
        if (settled) return
        settled = true
        handler.removeCallbacks(timeout)
        locationManager.removeUpdates(this)
        promise.resolve(locationToMap(location))
      }

      override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}

      override fun onProviderEnabled(provider: String) {}

      override fun onProviderDisabled(provider: String) {}
    }

    timeout = Runnable {
      if (settled) return@Runnable
      settled = true
      locationManager.removeUpdates(listener)
      if (lastKnown != null) {
        promise.resolve(locationToMap(lastKnown))
      } else {
        promise.reject("ERR_LOCATION_UNAVAILABLE", "Timed out while waiting for a location fix.", null)
      }
    }

    handler.postDelayed(timeout, 15_000)

    providers.forEach { provider ->
      runCatching {
        locationManager.requestLocationUpdates(provider, 0L, 0f, listener, Looper.getMainLooper())
      }
    }
  }

  private fun locationToMap(location: Location?): Map<String, Any?> {
    if (location == null) {
      return mapOf(
        "coords" to mapOf(
          "latitude" to 0.0,
          "longitude" to 0.0,
          "accuracy" to null,
          "altitude" to null,
          "altitudeAccuracy" to null,
          "heading" to null,
          "speed" to null,
        ),
        "timestamp" to 0.0,
      )
    }

    return mapOf(
      "coords" to mapOf(
        "latitude" to location.latitude,
        "longitude" to location.longitude,
        "accuracy" to location.accuracy.toDouble(),
        "altitude" to location.altitude,
        "altitudeAccuracy" to null,
        "heading" to if (location.hasBearing()) location.bearing.toDouble() else null,
        "speed" to if (location.hasSpeed()) location.speed.toDouble() else null,
      ),
      "timestamp" to location.time.toDouble(),
    )
  }
}
