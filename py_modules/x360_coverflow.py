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
    return raw
