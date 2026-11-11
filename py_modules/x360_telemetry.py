"""Read-only local Linux telemetry. No console sensor values are fabricated."""
from pathlib import Path
import shutil
import socket

def read_runtime(hwmon='/sys/class/hwmon', storage='/home'):
    result = {}
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as connection:
            connection.connect(('192.0.2.1', 9))
            address = connection.getsockname()[0]
            if address and not address.startswith('127.'):
                result['ip'] = address
    except OSError:
        pass
    sensors = []
    for chip in sorted(Path(hwmon).glob('hwmon*'))[:32]:
        try:
            name = (chip / 'name').read_text().strip().lower()
        except OSError:
            continue
        for source in sorted(chip.glob('temp*_input'))[:32]:
            try:
                value = float(source.read_text().strip()) / 1000
                label_path = source.with_name(source.name.replace('_input', '_label'))
                label = label_path.read_text().strip() if label_path.exists() else source.stem
                if -20 <= value <= 150:
                    sensors.append({'chip': name, 'label': label, 'celsius': value})
            except (OSError, ValueError):
                continue
    result['sensors'] = sensors
    cpu = next((s for s in sensors if s['chip'] in ('k10temp', 'zenpower', 'coretemp') and s['label'].lower() in ('tctl', 'tdie', 'package id 0')), None)
    gpu = next((s for s in sensors if s['chip'] == 'amdgpu' and s['label'].lower() in ('edge', 'junction')), None)
    if cpu:
        result['cpuC'] = cpu['celsius']
    if gpu:
        result['gpuC'] = gpu['celsius']
    try:
        usage = shutil.disk_usage(storage)
        result['storageTotalBytes'] = usage.total
        result['storageFreeBytes'] = usage.free
    except OSError:
        pass
    return result
