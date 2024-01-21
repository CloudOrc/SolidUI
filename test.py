import matplotlib.pyplot as plt
import numpy as np

# 设置参数方程
t = np.linspace(0, 2 * np.pi, 200)
x = 16 * np.sin(t) ** 3
y = 13 * np.cos(t) - 5 * np.cos(2 * t) - 2 * np.cos(3 * t) - np.cos(4 * t)

# 创建图形和轴
fig, ax = plt.subplots()

# 绘制爱心
ax.plot(x, y, color='red')

# 设置坐标轴比例相同
ax.axis('equal')

# 隐藏坐标轴
ax.axis('off')

# 显示图形
plt.show()