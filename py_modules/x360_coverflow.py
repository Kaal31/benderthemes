"""Bounded, non-executing Aurora .cfljson layout reader."""
import json
import math

MAX_LAYOUT = 512 * 1024

def read_layout(data):
    if len(data) > MAX_LAYOUT:
        raise ValueError('Coverflow layout exceeds size limit')
    raw = json.loads(data.decode('utf-8-sig') if isinstance(data, bytes) else data)
    if not isinstance(raw, dict) or not isinstance(raw.get('modes'), list) or not 1 <= len(raw['modes']) <= 32:
        raise ValueError('Invalid coverflow modes')
    def bounded(value, depth=0):
        if depth > 10:
            raise ValueError('Layout nesting limit')
        if isinstance(value, bool) or value is None:
            return value
        if isinstance(value, (int, float)):
            if not math.isfinite(value) or abs(value) > 100000:
                raise ValueError('Invalid coverflow number')
            return value
        if isinstance(value, str) and len(value) <= 512:
            return value
        if isinstance(value, list) and len(value) <= 64:
            return [bounded(v, depth + 1) for v in value]
        if isinstance(value, dict) and len(value) <= 64:
            if any(not isinstance(k, str) or len(k) > 80 or k in ('__proto__', 'constructor', 'prototype') for k in value):
                raise ValueError('Invalid layout property')
            return {k: bounded(v, depth + 1) for k, v in value.items()}
        raise ValueError('Unsupported coverflow value')
    raw = bounded(raw)
    def validate_vector(value, path):
        if not isinstance(value, list) or len(value) != 3 or any(isinstance(v, bool) or not isinstance(v, (int, float)) for v in value):
            raise ValueError('Invalid coverflow vector: ' + path)
    props = raw.get('properties', {})
    for key, maximum in [('rows', 32), ('columns', 512), ('pagesize', 128)]:
        value = props.get(key, 1)
        if isinstance(value, bool) or not isinstance(value, int) or not 1 <= value <= maximum:
            raise ValueError('Invalid coverflow ' + key)
    for mode in raw['modes']:
        if not isinstance(mode, dict) or not isinstance(mode.get('covers'), dict):
            raise ValueError('Invalid coverflow mode')
        for key in ('position', 'scale', 'angle', 'spacer', 'deltaangle'):
            values = mode['covers'].get(key, {})
            if not isinstance(values, dict):
                raise ValueError('Invalid cover transform')
            for vector in values.values():
                if not isinstance(vector, list) or len(vector) != 3 or any(isinstance(v, bool) or not isinstance(v, (int, float)) for v in vector):
                    raise ValueError('Invalid coverflow vector')
        camera = mode.get('camera', {})
        for key in ('position', 'aim'):
            if key in camera and (not isinstance(camera[key], list) or len(camera[key]) != 3 or any(isinstance(v, bool) or not isinstance(v, (int, float)) for v in camera[key])):
                raise ValueError('Invalid coverflow camera')
        for section, fields in [('light', ('position',)), ('mirror', ('offset',))]:
            obj = mode.get(section, {})
            if not isinstance(obj, dict):
                raise ValueError('Invalid coverflow ' + section)
            for key in fields:
                if key in obj:
                    validate_vector(obj[key], section + '.' + key)
        light = mode.get('light', {})
        for section, fields in [('color', ('ambient', 'diffuse')), ('material', ('diffuse',))]:
            obj = light.get(section, {})
            if not isinstance(obj, dict):
                raise ValueError('Invalid coverflow light.' + section)
            for key in fields:
                if key in obj:
                    validate_vector(obj[key], 'light.' + section + '.' + key)
        oscillation = mode['covers'].get('oscillation', {})
        if not isinstance(oscillation, dict):
            raise ValueError('Invalid coverflow oscillation')
        for axis in ('position', 'angle'):
            obj = oscillation.get(axis, {})
            if not isinstance(obj, dict):
                raise ValueError('Invalid coverflow oscillation.' + axis)
            for key in ('speed', 'amplitude'):
                if key in obj:
                    validate_vector(obj[key], 'oscillation.' + axis + '.' + key)
    return raw
